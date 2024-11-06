import {
  Group,
  Box,
  Stack,
  Accordion,
  createStyles,
  MediaQuery,
  useMantineTheme,
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
  Campaign,
  GameUnit,
} from "types/game";
import CurrentEventCountdown from "components/Homepage/CurrentEventCountdown";
import CurrentScoutsCountdown from "components/Homepage/CurrentScoutsCountdown";
import SiteAnnouncements from "components/Homepage/SiteAnnouncements";
import UserVerification from "components/Homepage/UserVerification";
import { Locale, MakoPost, QuerySuccess, StrapiItem } from "types/makotools";
import { createBirthdayData } from "services/campaigns";
import { fetchOceans } from "services/makotools/posts";
import RecommendedCountdown from "components/Homepage/RecommendedCountdown";
import useUser from "services/firebase/user";
import { getNameOrderSetting } from "components/utilities/formatting/NameOrder";

const MOBILE_BREAKPOINT = "md";
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
  locale,
  posts,
  width = 300,
  ...props
}: {
  events: (Event | Birthday | Scout)[];
  locale: string | undefined;
  posts: StrapiItem<MakoPost>[];
  width?: number;
}) {
  const theme = useMantineTheme();
  return (
    <Box
      sx={{
        "&&&": { flexShrink: 0, flexGrow: 0 },
        [`@media (max-width: ${theme.breakpoints[MOBILE_BREAKPOINT]}px)`]: {
          flexBasis: "100%",
          flexGrow: 1,
        },
        [`@media (min-width: ${theme.breakpoints[MOBILE_BREAKPOINT]}px)`]: {
          flexBasis: width,
        },
      }}
      {...props}
    >
      <Accordion
        variant="contained"
        defaultValue={["birthday", "announcement"]}
        multiple
        sx={{
          flexGrow: 1,
          minWidth: 0,
          width: "100%",
          [`@media (min-width: ${theme.breakpoints[MOBILE_BREAKPOINT]}px)`]: {
            flexBasis: width,
          },
        }}
      >
        <UpcomingCampaigns
          events={events as (Birthday | Scout | Event)[]}
          locale={locale}
        />
        <SiteAnnouncements posts={posts} />
      </Accordion>
    </Box>
  );
}

function Page({
  locale,
  posts,
  charactersQuery,
  gameEventsQuery,
  scoutsQuery,
  cardsQuery,
  unitsQuery,
}: {
  locale: Locale;
  posts: StrapiItem<MakoPost>[];
  charactersQuery: QuerySuccess<GameCharacter[]>;
  gameEventsQuery: QuerySuccess<Event[]>;
  scoutsQuery: QuerySuccess<Scout[]>;
  cardsQuery: QuerySuccess<GameCard[]>;
  unitsQuery: QuerySuccess<GameUnit[]>;
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

  const units: GameUnit[] = useMemo(() => unitsQuery.data, [unitsQuery.data]);

  const birthdays: Birthday[] = createBirthdayData(
    characters,
    getNameOrderSetting(user),
    locale
  );
  const gameEvents: Event[] = useMemo(
    () => gameEventsQuery.data,
    [gameEventsQuery.data]
  );
  const scouts: Scout[] = useMemo(() => scoutsQuery.data, [scoutsQuery.data]);

  const events: Campaign[] = [...birthdays, ...(gameEvents ?? []), ...scouts];

  const cards: GameCard[] = useMemo(() => cardsQuery.data, [cardsQuery.data]);

  interface RecommendedCampaign {
    event: Campaign;
    charId?: number;
    unitId?: number;
  }

  function getRecommendedCampaigns(): RecommendedCampaign[] {
    if (!user.loggedIn) return [];
    let faveCharas = user.db.profile__fave_charas;
    let faveUnits = user.db.profile__fave_units;
    let recommendedCampaigns: RecommendedCampaign[] = [];
    events.forEach((event: Campaign) => {
      if (event.type === "birthday") {
        // only check favorite characters
        if (faveCharas && faveCharas.includes(event.character_id))
          recommendedCampaigns.push({
            event: event,
            charId: event.character_id,
          });
      } else {
        if (event.type === "song" || event.type === "tour") {
          // these events should check for units
          if (
            event.unit_id?.some((uid) => faveUnits && faveUnits.includes(uid))
          ) {
            recommendedCampaigns.push({
              event: event,
              unitId: event.unit_id.find(
                (uid) => faveUnits && faveUnits.includes(uid)
              ),
            });
          }
        }
        // check if the event includes a relevant character card
        let eventCards: GameCard[] = cards.filter((card) =>
          event.cards.includes(card.id)
        );
        eventCards.forEach((card: GameCard) => {
          if (
            faveCharas &&
            faveCharas.includes(card.character_id) &&
            (card.rarity === 5 || card.rarity === 4)
          ) {
            // only include 5* or 4* features
            if (!recommendedCampaigns.find((c) => c.event === event)) {
              // no duplicate events
              recommendedCampaigns.push({
                event: event,
                charId: card.character_id,
              });
            }
          }
        });
      }
    });
    return recommendedCampaigns;
  }

  return (
    <Group
      align="flex-start"
      spacing="xl"
      mt="sm"
      noWrap
      className={classes.main}
    >
      <Stack
        align="flex-start"
        spacing="lg"
        className={classes.mainCol}
        sx={{ flexGrow: 1 }}
      >
        <Banner events={events} />
        <UserVerification />

        <Group
          align="start"
          sx={{
            flexWrap: "wrap-reverse",
            flexGrow: 1,
            width: "100%",
          }}
          className={classes.mainCol}
        >
          <Box
            sx={{ width: "100%", "&&": { flexGrow: 1 } }}
            className={classes.mainCol}
          >
            <CurrentEventCountdown
              events={
                events.filter(
                  (event: Event) =>
                    event.event_id &&
                    (event.type === "song" ||
                      event.type === "tour" ||
                      event.type === "shuffle" ||
                      event.type === "special")
                ) as Event[]
              }
            />
            <CurrentScoutsCountdown scouts={scouts} />
            {user.loggedIn && (
              <RecommendedCountdown
                events={getRecommendedCampaigns()}
                characters={characters}
                units={units}
              />
            )}
          </Box>

          <MediaQuery
            largerThan={MOBILE_BREAKPOINT}
            styles={{ display: "none" }}
          >
            <SidePanel events={events} posts={posts} locale={locale} />
          </MediaQuery>
        </Group>
      </Stack>

      <MediaQuery smallerThan={MOBILE_BREAKPOINT} styles={{ display: "none" }}>
        <SidePanel events={events} posts={posts} locale={locale} />
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

  const unitsQuery = await getLocalizedDataArray<GameUnit>(
    "units",
    locale,
    "id"
  );

  try {
    const postResponses = await fetchOceans<StrapiItem<MakoPost>[]>("/posts", {
      populate: "*",
      sort: "date_created:desc",
      pagination: { page: 1, pageSize: 8 },
    });

    return {
      props: {
        locale: locale,
        posts: postResponses.data,
        charactersQuery: characters,
        gameEventsQuery: gameEvents,
        scoutsQuery: scouts,
        cardsQuery: cardsQuery,
        unitsQuery: unitsQuery,
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
