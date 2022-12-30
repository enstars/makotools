import {
  Group,
  Box,
  Stack,
  Accordion,
  createStyles,
  MediaQuery,
} from "@mantine/core";
// import Banner from "assets/banner.png";
import { useMemo } from "react";
import useTranslation from "next-translate/useTranslation";

import { getLayout } from "components/Layout";
import UpcomingCampaigns from "components/Homepage/UpcomingCampaigns";
import Banner from "components/Homepage/Banner";
import getServerSideUser from "services/firebase/getServerSideUser";
import { getLocalizedDataArray } from "services/data";
import {
  Birthday,
  GameCharacter,
  Event,
  Scout,
  GameCard,
  RecommendedEvents,
  Campaign,
} from "types/game";
import CurrentEventCountdown from "components/Homepage/CurrentEventCountdown";
import CurrentScoutsCountdown from "components/Homepage/CurrentScoutsCountdown";
import SiteAnnouncements from "components/Homepage/SiteAnnouncements";
import UserVerification from "components/Homepage/UserVerification";
import { MakoPost, QuerySuccess, StrapiItem } from "types/makotools";
import { createBirthdayData } from "services/campaigns";
import { fetchOceans } from "services/makotools/posts";
import RecommendedCountdown from "components/Homepage/RecommendedCountdown";
import useUser from "services/firebase/user";

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
  events: (Event | Birthday | Scout)[];
  posts: StrapiItem<MakoPost>[];
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
        <UpcomingCampaigns events={events as (Birthday | Scout | Event)[]} />
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
  cardsQuery,
}: {
  posts: StrapiItem<MakoPost>[];
  charactersQuery: QuerySuccess<GameCharacter[]>;
  gameEventsQuery: QuerySuccess<Event[]>;
  scoutsQuery: QuerySuccess<Scout[]>;
  cardsQuery: QuerySuccess<GameCard[]>;
}) {
  const user = useUser();
  const { t } = useTranslation();
  const { classes } = useStyles();

  const faveCharas =
    user.loggedIn && user.db && user.db.profile__fave_charas
      ? user.db.profile__fave_charas
      : [];

  const characters: GameCharacter[] = useMemo(
    () => charactersQuery.data,
    [charactersQuery.data]
  );

  const birthdays: Birthday[] = createBirthdayData(characters);
  const gameEvents: Event[] = useMemo(
    () => gameEventsQuery.data,
    [gameEventsQuery.data]
  );
  const scouts: Scout[] = useMemo(() => scoutsQuery.data, [scoutsQuery.data]);

  const events: Campaign[] = [...birthdays, ...gameEvents, ...scouts];

  const cards: GameCard[] = useMemo(() => cardsQuery.data, [cardsQuery.data]);

  const containsLikedCharacter = (e: Event | Scout | Birthday): boolean => {
    if (faveCharas.length > 0) {
      if (e.type === "birthday") {
        // if this is a birthday event
        return faveCharas.includes(e.character_id);
      } else {
        const eventCards = e.cards;
        const relevantCards = cards.filter(
          (card) => faveCharas.includes(card.character_id) && card.rarity === 5
        );
        return (
          eventCards?.some(
            (r) => relevantCards.filter((c) => c.id === r).length > 0
          ) || false
        );
      }
    } else {
      return false;
    }
  };

  function createEvents(): RecommendedEvents[] {
    let listOfEvents: RecommendedEvents[] = [];
    const filteredEvents = events.filter(containsLikedCharacter);
    if (faveCharas.length > 0) {
      filteredEvents.forEach((e) => {
        if (e.type === "birthday") {
          listOfEvents.push({
            event: e,
            charId: e.character_id,
          });
        } else {
          const eventCards = e.cards;
          const relevantCards = cards.filter(
            (card) =>
              eventCards?.includes(card.id) &&
              card.rarity === 5 &&
              faveCharas.includes(card.character_id)
          );
          let charId = relevantCards[0].character_id;
          listOfEvents.push({ event: e, charId });
        }
      });
    }

    return listOfEvents;
  }

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
                  (event: Event) =>
                    event.event_id &&
                    (event.type === "song" || event.type === "tour")
                ) as Event[]
              }
            />
            <CurrentScoutsCountdown scouts={scouts} />
            {user.loggedIn && (
              <RecommendedCountdown
                events={createEvents()}
                characters={characters}
              />
            )}
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

  const scouts = await getLocalizedDataArray<Scout>(
    "scouts",
    locale,
    "gacha_id"
  );

  const cardsQuery = await getLocalizedDataArray<GameCard>(
    "cards",
    locale,
    "id",
    ["id", "character_id", "rarity"]
  );

  try {
    const postResponses = await fetchOceans<StrapiItem<MakoPost>[]>("/posts", {
      populate: "*",
      sort: "date_created:desc",
      pagination: { page: 1, pageSize: 8 },
    });

    return {
      props: {
        posts: postResponses.data,
        charactersQuery: characters,
        gameEventsQuery: gameEvents,
        scoutsQuery: scouts,
        cardsQuery: cardsQuery,
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
