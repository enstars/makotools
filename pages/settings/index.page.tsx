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
  Box,
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
import { getLocalizedData } from "../../services/ensquare";

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
import Banner from "./profile/Banner";

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
        </Stack>
      </>
    ),
  },
  {
    label: "Profile",
    value: "profile",
    icon: IconPencil,
    color: "lightblue",
    contents: ({ cards }: { cards: GameCard[] | undefined }) => (
      <>
        <Stack>
          <Alert color="yellow">
            These are publicly accessible from your profile page, so make sure
            to follow our community guidelines.
          </Alert>
          <Name />
          <Pronouns />
          {cards && <Banner cards={cards} />}
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
    contents: () => (
      <>
        <Stack>
          <Email />
          <ColorCode />
        </Stack>
      </>
    ),
  },
];

function Page({ cards }: { cards: GameCard[] | undefined }) {
  const router = useRouter();
  const theme = useMantineTheme();
  const { width } = useViewportSize();

  const [isNarrowPage, setIsNarrowPage] = useState(true);
  // const isNarrowPage = width < theme.breakpoints.sm;

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
                    <t.icon
                      size={14}
                      // color={theme.other.getColor(theme, t.color)}
                    />
                  </ThemeIcon>
                }
              >
                {t.label}
              </Accordion.Control>
              <Accordion.Panel>
                <t.contents cards={cards} />
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      ) : (
        <Tabs
          defaultValue="content"
          orientation={"vertical"}
          styles={{
            tabsList: {
              marginRight: !isNarrowPage ? 16 : undefined,
              marginBottom: isNarrowPage ? 8 : undefined,
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
              <t.contents cards={cards} />
            </Tabs.Panel>
          ))}
        </Tabs>
      )}
    </>
  );
}

export const getServerSideProps = getServerSideUser(
  async ({ locale }) => {
    const cards = await getLocalizedData<GameCard[]>("cards", locale, [
      "id",
      "title",
      "name",
      "rarity",
    ]);
    if (!cards) return { props: { cards: undefined } };
    const bannerIds = cards.main.data
      .filter((c) => c.rarity >= 4)
      .map((c) => c.id);

    return {
      props: {
        cards: cards.mainLang.data.filter((c) => bannerIds.includes(c.id)),
      },
    };
  },
  { whenUnauthed: AuthAction.REDIRECT_TO_LOGIN }
);
Page.getLayout = getLayout({ hideFooter: true });
export default Page;
