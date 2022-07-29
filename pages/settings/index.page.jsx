import { useState, useEffect, forwardRef } from "react";
import PageTitle from "../../components/PageTitle";
import { useFirebaseUser } from "../../services/firebase/user";
import { useRouter } from "next/router";
import SelectSetting from "./shared/SelectSetting";
import Region from "./content/Region";
import NameOrder from "./content/NameOrder";
import DarkMode from "./appearance/DarkMode";
import ShowTlBadge from "./appearance/ShowTlBadge";
import Name from "./profile/Name";
import Username from "./profile/Username";
import ColorCode from "./profile/ColorCode";
import { useViewportSize } from "@mantine/hooks";
import { AuthAction } from "next-firebase-auth";
import getServerSideUser from "../../services/firebase/getServerSideUser";
import {
  Stack,
  useMantineTheme,
  useMantineColorScheme,
  Tabs,
  Center,
  Loader,
} from "@mantine/core";

import { IconUserCircle, IconBrush, IconDeviceGamepad2 } from "@tabler/icons";
import Bio from "./profile/Bio";

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
      <PageTitle title="Settings" />
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
              icon={<IconBrush size={14} />}
              color="violet"
            >
              Appearance
            </Tabs.Tab>
            <Tabs.Tab
              value="profile"
              icon={<IconUserCircle size={14} />}
              color="lightblue"
            >
              Profile
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
              <Name />
              <Username />
              <Bio />
              <ColorCode />
            </Stack>
          </Tabs.Panel>
        </Tabs>
      )}
    </>
  );
}

export default Page;

import Layout from "../../components/Layout";

Page.getLayout = function getLayout(page, pageProps) {
  return <Layout pageProps={pageProps}>{page}</Layout>;
};

export const getServerSideProps = getServerSideUser(
  async () => {
    return {
      props: {},
    };
  },
  { whenUnauthed: AuthAction.REDIRECT_TO_LOGIN }
);
