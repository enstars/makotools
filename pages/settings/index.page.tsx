import { useState, useEffect } from "react";
import { useViewportSize } from "@mantine/hooks";
import { AuthAction } from "next-firebase-auth";
import {
  Stack,
  useMantineTheme,
  Tabs,
  Alert,
  Accordion,
  ThemeIcon,
  Group,
  Text,
} from "@mantine/core";
import {
  IconUserCircle,
  IconDeviceGamepad2,
  IconPalette,
  IconPencil,
  IconAlertCircle,
  IconFriends,
} from "@tabler/icons";
import dynamic from "next/dynamic";
import Link from "next/link";

import Region from "./content/Region";
import NameOrder from "./content/NameOrder";
import DarkMode from "./appearance/DarkMode";
import ShowTlBadge from "./appearance/ShowTlBadge";
import Name from "./profile/Name";
import Pronouns from "./profile/Pronouns";
import Username from "./profile/Username";
import ColorCode from "./account/ColorCode";
import StartPlaying from "./profile/StartPlaying";
import Email from "./account/Email";
import Banner from "./profile/Banner";
import UseWebP from "./appearance/UseWebP";
import Requests from "./friends/Requests";

import { getLayout } from "components/Layout";
import PageTitle from "components/sections/PageTitle";
import { getLocalizedDataArray } from "services/data";
import getServerSideUser from "services/firebase/getServerSideUser";
import { GameCard } from "types/game";
import useUser from "services/firebase/user";

const Bio = dynamic(() => import("./profile/Bio"), {
  ssr: false,
});
const tabs = [
  {
    label: "Content",
    value: "content",
    icon: IconDeviceGamepad2,
    color: "yellow",
    contents: () => (
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
    contents: () => (
      <>
        <Stack>
          <DarkMode />
          <ShowTlBadge />
          <UseWebP />
        </Stack>
      </>
    ),
  },
  {
    label: "Profile",
    value: "profile",
    icon: IconPencil,
    color: "lightblue",
    contents: ({
      cards,
      user,
    }: {
      cards: GameCard[] | undefined;
      user: any;
    }) => (
      <>
        <Stack>
          {user.db?.admin?.disableTextFields ? (
            <Alert
              icon={<IconAlertCircle size={16} />}
              color="red"
              sx={{ marginTop: "2vh" }}
            >
              You&apos;ve been restricted from editing your profile. You can
              submit an appeal through our{" "}
              <Text
                component={Link}
                href="/issues"
                sx={{ textDecoration: "underline" }}
              >
                issues
              </Text>{" "}
              page.
            </Alert>
          ) : (
            <Alert color="yellow">
              These are publicly accessible from your profile page, so make sure
              to follow our community guidelines.
            </Alert>
          )}
          <Group>
            <Name />
            <Pronouns />
          </Group>
          <Bio />
          {cards && <Banner cards={cards} />}
          <StartPlaying />
        </Stack>
      </>
    ),
  },
  {
    label: "Friends",
    value: "friends",
    icon: IconFriends,
    color: "green",
    contents: () => (
      <>
        <Stack>
          <Requests />
        </Stack>
      </>
    ),
  },
  {
    label: "Account",
    value: "account",
    icon: IconUserCircle,
    color: "hokke",
    contents: () => (
      <>
        <Stack>
          <Username />
          <Email />
          <ColorCode />
        </Stack>
      </>
    ),
  },
];

function Page({ cards }: { cards: GameCard[] | undefined }) {
  const theme = useMantineTheme();
  const { width } = useViewportSize();
  const user = useUser();

  const [isNarrowPage, setIsNarrowPage] = useState(true);

  useEffect(() => {
    setIsNarrowPage(width < theme.breakpoints.sm);
  }, [width, theme.breakpoints.sm]);

  return (
    <>
      <PageTitle title="Settings" mb={16} />
      {isNarrowPage ? (
        <Accordion
          multiple
          defaultValue={tabs.map((t) => t.value)}
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
                    <t.icon size={14} />
                  </ThemeIcon>
                }
              >
                {t.label}
              </Accordion.Control>
              <Accordion.Panel>
                <t.contents cards={cards} user={user} />
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      ) : (
        <Tabs
          defaultValue="content"
          orientation="vertical"
          styles={{
            tabsList: {
              marginRight: !isNarrowPage ? 16 : undefined,
              marginBottom: isNarrowPage ? 8 : undefined,
            },
            panel: {
              flexBasis: 0,
              minWidth: 0,
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

          {tabs.map(({ value, ...t }) => (
            <Tabs.Panel key={value} value={value}>
              <t.contents cards={cards} user={user} />
            </Tabs.Panel>
          ))}
        </Tabs>
      )}
    </>
  );
}

export const getServerSideProps = getServerSideUser(
  async ({ locale }) => {
    const cards = await getLocalizedDataArray<GameCard>("cards", locale, "id", [
      "id",
      "title",
      "name",
      "rarity",
    ]);
    if (cards.status === "error") return { props: { cards: undefined } };
    const bannerIds = cards.data.filter((c) => c.rarity >= 4).map((c) => c.id);

    return {
      props: {
        cards: cards.data.filter((c) => bannerIds.includes(c.id)),
      },
    };
  },
  { whenUnauthed: AuthAction.REDIRECT_TO_LOGIN }
);
Page.getLayout = getLayout({ hideFooter: true });
export default Page;
