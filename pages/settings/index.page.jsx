import { useState, useEffect, forwardRef } from "react";

import { useRouter } from "next/router";

import { useViewportSize } from "@mantine/hooks";

import { AuthAction } from "next-firebase-auth";

import {
  Stack,
  useMantineTheme,
  useMantineColorScheme,
  Tabs,
  Center,
  Loader,
  Text,
  Alert,
  Accordion,
  ThemeIcon,
} from "@mantine/core";

import {
  IconUserCircle,
  IconBrush,
  IconDeviceGamepad2,
  IconEditCircle,
  IconIdBadge,
  IconPalette,
  IconPencil,
} from "@tabler/icons";

import PageTitle from "../../components/sections/PageTitle";
import { useFirebaseUser } from "../../services/firebase/user";

import getServerSideUser from "../../services/firebase/getServerSideUser";

import { getLayout } from "../../components/Layout";

import SelectSetting from "./shared/SelectSetting";
import Region from "./content/Region";
import NameOrder from "./content/NameOrder";
import DarkMode from "./appearance/DarkMode";
import ShowTlBadge from "./appearance/ShowTlBadge";
import Name from "./profile/Name";
import Pronouns from "./profile/Pronouns";
import Username from "./profile/Username";
import ColorCode from "./account/ColorCode";

import Bio from "./profile/Bio";

import StartPlaying from "./profile/StartPlaying";
import Email from "./account/Email";

const tabs = [
  {
    label: "Content",
    value: "content",
    icon: IconDeviceGamepad2,
    color: "yellow",
    contents: (
      <>
        <Stack>
          <Region />
          <NameOrder />
        </Stack>
      </>
    ),
  },
  {
    label: "Appearance",
    value: "appearance",
    icon: IconPalette,
    color: "violet",
    contents: (
      <>
        <Stack>
          <DarkMode />

          <ShowTlBadge />
        </Stack>
      </>
    ),
  },
  {
    label: "Profile",
    value: "profile",
    icon: IconPencil,
    color: "lightblue",
    contents: (
      <>
        <Stack>
          <Alert size="sm" color="yellow">
            These are publicly accessible from your profile page, so make sure
            to follow our community guidelines.
          </Alert>
          <Name />
          <Pronouns />
          <Username />
          <Bio />
          <StartPlaying />
        </Stack>
      </>
    ),
  },
  {
    label: "Account",
    value: "account",
    icon: IconUserCircle,
    color: "blue",
    contents: (
      <>
        <Stack>
          <Email />
          <ColorCode />
        </Stack>
      </>
    ),
  },
];

function Page() {
  const router = useRouter();
  const theme = useMantineTheme();
  const { width } = useViewportSize();

  const [isNarrowPage, setIsNarrowPage] = useState(true);
  // const isNarrowPage = width < theme.breakpoints.sm;

  useEffect(() => {
    setIsNarrowPage(width < theme.breakpoints.sm);
  });

  return (
    <>
      <PageTitle title="Settings" mb={16} />
      {isNarrowPage ? (
        <Accordion
          multiple
          defaultValue={[tabs.map((t) => t.value)]}
          styles={(theme) => ({
            control: {
              padding: theme.spacing.xs,
            },
            label: {
              fontWeight: 500,
              fontSize: theme.fontSizes.md,
            },
            content: {
              paddingLeft: theme.spacing.xs,
              paddingRight: theme.spacing.xs,
            },
          })}
        >
          {tabs.map((t) => (
            <Accordion.Item key={t.value} value={t.value}>
              <Accordion.Control
                icon={
                  <ThemeIcon color={t.color} variant="light">
                    <t.icon
                      size={14}
                      // color={theme.other.getColor(theme, t.color)}
                    />
                  </ThemeIcon>
                }
              >
                {t.label}
              </Accordion.Control>
              <Accordion.Panel>{t.contents}</Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      ) : (
        <Tabs
          defaultValue="content"
          orientation={"vertical"}
          styles={{
            tabsList: {
              marginRight: !isNarrowPage && 16,
              marginBottom: isNarrowPage && 8,
            },
          }}
        >
          <Tabs.List>
            {tabs.map(({ value, color, label, ...props }) => (
              <Tabs.Tab
                key={value}
                value={value}
                icon={<props.icon size={14} />}
                color={color}
              >
                {label}
              </Tabs.Tab>
            ))}
          </Tabs.List>

          {tabs.map(({ value, contents }) => (
            <Tabs.Panel key={value} value={value}>
              {contents}
            </Tabs.Panel>
          ))}
        </Tabs>
      )}
    </>
  );
}

export const getServerSideProps = getServerSideUser(
  async () => {
    return {
      props: {},
    };
  },
  { whenUnauthed: AuthAction.REDIRECT_TO_LOGIN }
);
Page.getLayout = getLayout({});
export default Page;
