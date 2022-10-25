import Link from "next/link";
import {
  useMantineTheme,
  Title as MantineTitle,
  Text,
  List,
  Group,
  Box,
  AspectRatio,
  Anchor,
  Image as MantineImage,
  Stack,
  Accordion,
  createStyles,
  MediaQuery,
} from "@mantine/core";
import Image from "next/image";
import { IconNews } from "@tabler/icons";

// import Banner from "../assets/banner.png";
import AffiliatesLight from "../assets/Affiliates/affiliates_light.svg?url";
import AffiliatesDark from "../assets/Affiliates/affiliates_dark.svg?url";
import { getLayout } from "../components/Layout";
import getServerSideUser from "../services/firebase/getServerSideUser";
import { getLocalizedDataArray } from "../services/data";
import UpcomingCampaigns from "../components/Homepage/UpcomingCampaigns";

import Announcement from "./about/announcements/components/Announcement";

import {
  BirthdayEvent,
  GameCharacter,
  GameEvent,
  ScoutEvent,
} from "types/game";
import { retrieveEvents } from "services/events";
import CurrentEventCountdown from "components/Homepage/CurrentEventCountdown";
import CurrentScoutsCountdown from "components/Homepage/CurrentScoutsCountdown";
import Banner from "../components/Homepage/Banner";
import SiteAnnouncements from "components/Homepage/SiteAnnouncements";
import { forwardRef } from "react";

const useStyles = createStyles((theme, _params) => ({
  mainCol: {
    [`@media (min-width: 768px)`]: {
      // maxWidth: "70%",
    },
  },
}));

function SidePanel({
  events,
  posts,
  width = 250,
  ...props
}: {
  events: (GameEvent | BirthdayEvent | ScoutEvent)[];
  posts: any;
  width?: number;
}) {
  return (
    <Box sx={{ width: width, flexShrink: 0, flexGrow: 1 }} {...props}>
      <Accordion
        variant="contained"
        defaultValue={["birthday", "announcement"]}
        multiple
        sx={{ flexBasis: 300, flexGrow: 1, minWidth: 0, width: "100%" }}
      >
        <UpcomingCampaigns
          events={events as (BirthdayEvent | ScoutEvent | GameEvent)[]}
        />
        <SiteAnnouncements posts={posts} />
      </Accordion>
    </Box>
  );
}

function Page({
  posts,
  events,
}: {
  posts: any;
  events: (BirthdayEvent | GameEvent | ScoutEvent)[];
}) {
  const { classes } = useStyles();

  return (
    <Group align="flex-start" spacing="xl" mt="sm" noWrap>
      <Stack align="flex-start" spacing="lg" className={classes.mainCol}>
        <Banner events={events} />

        <Group align="start" sx={{ flexWrap: "wrap-reverse" }}>
          <Box sx={{ "&&": { flexBasis: 300, flexGrow: 2 } }}>
            <CurrentEventCountdown
              events={
                events.filter(
                  (event: GameEvent) => event.event_id
                ) as GameEvent[]
              }
            />
            <CurrentScoutsCountdown
              scouts={
                events.filter(
                  (scout: ScoutEvent) => scout.gacha_id
                ) as ScoutEvent[]
              }
            />
          </Box>
          <MediaQuery largerThan="md" styles={{ display: "none" }}>
            <SidePanel events={events} posts={posts} />
          </MediaQuery>
        </Group>
      </Stack>

      <MediaQuery smallerThan="md" styles={{ display: "none" }}>
        <SidePanel events={events} posts={posts} />
      </MediaQuery>
    </Group>
  );
}

Page.getLayout = getLayout({ wide: true });
export default Page;

export const getServerSideProps = getServerSideUser(async ({ locale }) => {
  const characters = await getLocalizedDataArray<GameCharacter>(
    "characters",
    locale,
    "character_id"
  );

  const gameEvents: any = await getLocalizedDataArray<GameEvent>(
    "events",
    locale,
    "event_id"
  );

  const scouts = await getLocalizedDataArray<ScoutEvent>(
    "scouts",
    locale,
    "gacha_id"
  );

  let events: (BirthdayEvent | GameEvent | ScoutEvent)[] = retrieveEvents({
    characters: characters.data,
    gameEvents: gameEvents.data,
    scouts: scouts.data,
  });

  try {
    const initRespose = await fetch(
      `https://backend-stars.ensemble.moe/wp-main/wp-json/wp/v2/posts?categories=5,6&per_page=5&page=1`
    );
    const initData = await initRespose.json();

    return {
      props: {
        posts: initData,
        events: events,
      },
    };
  } catch (e) {
    return {
      props: {
        posts: {
          error: true,
        },
        events: events,
      },
    };
  }
});
