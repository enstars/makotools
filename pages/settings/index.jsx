import { useState, useEffect, forwardRef } from "react";
import Title from "../../components/Title";
import { useAuth } from "../../services/auth";
import { useUserData } from "../../services/userData";
import { useRouter } from "next/router";
import DebouncedUserInput from "../../components/core/DebouncedUserInput";
import DebouncedUsernameInput from "../../components/core/DebouncedUsernameInput";
import {
  Modal,
  Button,
  Group,
  Select,
  Loader,
  Text,
  Paper,
  Tabs,
  Stack,
  Title as MantineTitle,
  ThemeIcon,
  LoadingOverlay,
  useMantineTheme,
  useMantineColorScheme,
  TextInput,
  Accordion,
  ActionIcon,
  SegmentedControl,
} from "@mantine/core";

import {
  IconSun,
  IconMoonStars,
  IconUserCircle,
  IconBrush,
  IconDeviceGamepad2,
  IconAt,
  IconPencil,
} from "@tabler/icons";
import Flags from "country-flag-icons/react/3x2";

const gameRegions = [
  {
    value: "jp",
    label: "Japan",
    icon: <Flags.JP height={16} style={{ borderRadius: 3 }} />,
  },
  {
    value: "cn",
    label: "Mainland China",
    icon: <Flags.CN height={16} style={{ borderRadius: 3 }} />,
  },
  {
    value: "kr",
    label: "Korea",
    icon: <Flags.KR height={16} style={{ borderRadius: 3 }} />,
  },
  {
    value: "tw",
    label: "Taiwan",
    icon: <Flags.TW height={16} style={{ borderRadius: 3 }} />,
  },
  {
    value: "en",
    label: "United Kingdom, Canada, Australia",
    icon: <Flags.GB height={16} style={{ borderRadius: 3 }} />,
  },
  {
    value: "us",
    label: "United States",
    icon: <Flags.US height={16} style={{ borderRadius: 3 }} />,
  },
];

const SelectItemForwardRef = forwardRef(function SelectItem(
  { label, icon, ...props },
  ref
) {
  return (
    <div ref={ref} {...props}>
      <Group spacing="xs">
        {icon}
        <Text size="sm">{label}</Text>
      </Group>
    </div>
  );
});

function DarkModeOption() {
  const { colorScheme } = useMantineColorScheme();
  const { userData, setUserDataKey } = useUserData();

  return (
    <SegmentedControl
      value={colorScheme || "dark"}
      itemComponent={SelectItemForwardRef}
      label={"Mode"}
      onChange={(value) => {
        setUserDataKey({ dark_mode: value === "dark" });
      }}
      data={[
        {
          value: "light",
          label: (
            <Group sx={{ display: "inline-flex" }} spacing={6}>
              <IconSun size={16} />
              <Text size="sm">Light Mode</Text>
            </Group>
          ),
        },
        {
          value: "dark",
          label: (
            <Group sx={{ display: "inline-flex" }} spacing={6}>
              <IconMoonStars size={16} />
              <Text size="sm">Dark Mode</Text>
            </Group>
          ),
        },
      ]}
      icon={
        colorScheme === "dark" ? (
          <IconMoonStars size={16} />
        ) : (
          <IconSun size={16} />
        )
      }
      // {...(userData.loading && { disabled: true })}
      size="xs"
    />
  );
}

function DropdownOption({ dataKey, data, label }) {
  const { userData, setUserDataKey } = useUserData();

  return (
    <Select
      value={userData?.[dataKey] || "jp"}
      label={label}
      onChange={(value) => {
        setUserDataKey({ [dataKey]: value });
      }}
      itemComponent={SelectItemForwardRef}
      icon={
        data.filter((r) => r.value === userData?.[dataKey])[0]?.icon ||
        gameRegions[0].icon
      }
      data={data}
      searchable
      // size="xs"
      // data={[]}
      // {...(userData.loading && { disabled: true })}
    />
  );
}

function Page() {
  const router = useRouter();
  const { user } = useAuth();
  const { userData } = useUserData();
  const [usernameModalOpen, setUsernameModalOpen] = useState(false);

  useEffect(() => {
    if (!userData.loading && !userData.loggedIn) {
      router.push("/login");
    }
  }, [userData, router]);

  return (
    <>
      <Title title="Settings" />
      <LoadingOverlay visible={userData.loading} />
      <Accordion
        disableIconRotation
        multiple
        styles={{ control: { paddingTop: 14, paddingBottom: 14 } }}
      >
        <Accordion.Item
          label="Content"
          icon={
            <ThemeIcon color="yellow" variant="light">
              <IconDeviceGamepad2 size={14} />
            </ThemeIcon>
          }
        >
          <Stack>
            <DropdownOption
              dataKey="content_region"
              label="Game Region"
              data={gameRegions}
            />
          </Stack>
        </Accordion.Item>
        <Accordion.Item
          label="Appearance"
          icon={
            <ThemeIcon color="violet" variant="light">
              <IconBrush size={14} />
            </ThemeIcon>
          }
        >
          <Stack>
            <DarkModeOption />
          </Stack>
        </Accordion.Item>
        <Accordion.Item
          label="Profile"
          icon={
            <ThemeIcon color="blue" variant="light">
              <IconUserCircle size={14} />
            </ThemeIcon>
          }
        >
          <Stack>
            <DebouncedUserInput label="Name" dataKey="name" />
            <Group align="end" spacing="xs">
              <TextInput
                label="Username"
                value={userData?.username}
                disabled
                icon={<IconAt size={16} />}
                sx={{ flexGrow: 1 }}
                rightSection={
                  <ActionIcon
                    onClick={() => setUsernameModalOpen(true)}
                    variant="filled"
                    color="blue"
                  >
                    <IconPencil size={14} />
                  </ActionIcon>
                }
              />
            </Group>
            <Modal
              opened={usernameModalOpen}
              onClose={() => setUsernameModalOpen(false)}
              title="Change Username"
              size="sm"
              centered
            >
              <DebouncedUsernameInput
                changedCallback={() => setUsernameModalOpen(false)}
              />
            </Modal>
          </Stack>
        </Accordion.Item>
      </Accordion>
    </>
  );
}

export default Page;

import Layout from "../../components/Layout";
Page.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
