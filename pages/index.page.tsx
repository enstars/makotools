import {
  Group,
  Box,
  Stack,
  Accordion,
  createStyles,
  MediaQuery,
} from "@mantine/core";
// import Banner from "../assets/banner.png";
import { useMemo } from "react";

import { getLayout } from "../components/Layout";
import getServerSideUser from "../services/firebase/getServerSideUser";
import { getLocalizedDataArray } from "../services/data";
import UpcomingCampaigns from "../components/Homepage/UpcomingCampaigns";
import Banner from "../components/Homepage/Banner";

import {
  BirthdayEvent,
  GameCharacter,
  GameEvent,
  ScoutEvent,
} from "types/game";
import CurrentEventCountdown from "components/Homepage/CurrentEventCountdown";
import CurrentScoutsCountdown from "components/Homepage/CurrentScoutsCountdown";
import SiteAnnouncements from "components/Homepage/SiteAnnouncements";
import UserVerification from "components/Homepage/UserVerification";
import { QuerySuccess } from "types/makotools";
import { createBirthdayData } from "services/events";

const useStyles = createStyles((theme, _params) => ({
  main: {
    maxWidth: "100%",
    "& > *": {
      minWidth: 0,
    },
  },
  mainCol: {
    maxWidth: "100%",
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
    <Box
      sx={{ "&&&": { flexBasis: width, flexShrink: 0, flexGrow: 2 } }}
      {...props}
    >
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
  charactersQuery,
  gameEventsQuery,
  scoutsQuery,
}: {
  posts: any;
  charactersQuery: QuerySuccess<GameCharacter[]>;
  gameEventsQuery: QuerySuccess<GameEvent[]>;
  scoutsQuery: QuerySuccess<ScoutEvent[]>;
}) {
  const { classes } = useStyles();

  const characters: GameCharacter[] = useMemo(
    () => charactersQuery.data,
    [charactersQuery.data]
  );

  const birthdays: BirthdayEvent[] = createBirthdayData(characters);
  console.log(birthdays);

  const gameEvents: GameEvent[] = useMemo(
    () => gameEventsQuery.data,
    [gameEventsQuery.data]
  );

  console.log(gameEvents);

  const scouts: ScoutEvent[] = useMemo(
    () => scoutsQuery.data,
    [scoutsQuery.data]
  );

  const events: (BirthdayEvent | GameEvent | ScoutEvent)[] = [
    ...birthdays,
    ...gameEvents,
    ...scouts,
  ];

  return (
    <Group
      align="flex-start"
      spacing="xl"
      mt="sm"
      noWrap
      className={classes.main}
    >
      <Stack align="flex-start" spacing="lg" className={classes.mainCol}>
        <Banner events={events} />
        <UserVerification />

        <Group
          align="start"
          sx={{
            flexWrap: "wrap-reverse",
          }}
          className={classes.mainCol}
        >
          <Box sx={{ "&&": { flexGrow: 1 } }} className={classes.mainCol}>
            <CurrentEventCountdown
              events={
                events.filter(
                  (event: GameEvent) => event.event_id
                ) as GameEvent[]
              }
            />
            <CurrentScoutsCountdown scouts={scouts} />
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

  const gameEvents: any = await getLocalizedDataArray(
    "events",
    locale,
    "event_id"
  );

  const scouts = await getLocalizedDataArray<ScoutEvent>(
    "scouts",
    locale,
    "gacha_id"
  );

  try {
    const initRespose = await fetch(
      `https://backend-stars.ensemble.moe/wp-main/wp-json/wp/v2/posts?categories=5,6&per_page=5&page=1`
    );
    const initData = await initRespose.json();

    return {
      props: {
        posts: initData,
        charactersQuery: characters,
        gameEventsQuery: gameEvents,
        scoutsQuery: scouts,
      },
    };
  } catch (e) {
    return {
      props: {
        posts: {
          error: true,
        },
        charactersQuery: characters,
        gameEventsQuery: gameEvents,
        scoutsQuery: scouts,
      },
    };
  }
});
