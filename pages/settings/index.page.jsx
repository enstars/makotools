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

import PageTitle from "../../components/PageTitle";
import { useFirebaseUser } from "../../services/firebase/user";

import getServerSideUser from "../../services/firebase/getServerSideUser";

import Layout from "../../components/Layout";

import { getLayout } from "../../../components/Layout";

import SelectSetting from "./shared/SelectSetting";
import Region from "./content/Region";
import NameOrder from "./content/NameOrder";
import DarkMode from "./appearance/DarkMode";
import ShowTlBadge from "./appearance/ShowTlBadge";
import Name from "./profile/Name";
import Username from "./profile/Username";
import ColorCode from "./account/ColorCode";

import Bio from "./profile/Bio";

import StartPlaying from "./profile/StartPlaying";
import Email from "./account/Email";

function Page() {
  const router = useRouter();
  const { firebaseUser } = useFirebaseUser();
  const [usernameModalOpen, setUsernameModalOpen] = useState(false);
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const { width } = useViewportSize();

  const isNarrowPage = width < theme.breakpoints.sm;

  return (
    <>
      <PageTitle title="Settings" mb={16} />
      {firebaseUser.loading ? (
        <Center>
          <Loader />
        </Center>
      ) : (
        <Tabs
          defaultValue="content"
          orientation={isNarrowPage ? "horizontal" : "vertical"}
          styles={{
            tabsList: {
              marginRight: !isNarrowPage && 16,
              marginBottom: isNarrowPage && 8,
            },
          }}
        >
          <Tabs.List>
            <Tabs.Tab
              value="content"
              icon={<IconDeviceGamepad2 size={14} />}
              color="yellow"
            >
              Content
            </Tabs.Tab>
            <Tabs.Tab
              value="appearance"
              icon={<IconPalette size={14} />}
              color="violet"
            >
              Appearance
            </Tabs.Tab>
            <Tabs.Tab
              value="profile"
              icon={<IconPencil size={14} />}
              color="lightblue"
            >
              Profile
            </Tabs.Tab>
            <Tabs.Tab
              value="account"
              icon={<IconUserCircle size={14} />}
              color="blue"
            >
              Account
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="content">
            <Stack>
              <Region />
              <NameOrder />
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="appearance">
            <Stack>
              <DarkMode />

              <ShowTlBadge />
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="profile">
            <Stack>
              <Alert size="sm" color="yellow">
                These are publicly accessible from your profile page, so make
                sure to follow our community guidelines.
              </Alert>
              <Name />
              <Username />
              <Bio />
              <StartPlaying />
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="account">
            <Stack>
              <Email />
              <ColorCode />
            </Stack>
          </Tabs.Panel>
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
