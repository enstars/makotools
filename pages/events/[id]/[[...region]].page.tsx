import { Paper, Text, useMantineTheme } from "@mantine/core";
import {
  IconBook,
  IconCards,
  IconDiamond,
  IconMusic,
  IconVinyl,
} from "@tabler/icons-react";
import { useMemo, useState } from "react";
import useTranslation from "next-translate/useTranslation";

import ESPageHeader from "../components/ESPageHeader";
import PointsTable from "../components/PointsTable";
import Stories from "../components/Stories";
import SectionTitle from "../components/SectionTitle";
import ScoutPointsSummary from "../components/ScoutPointsSummary";

import { getLayout } from "components/Layout";
import PageTitle from "components/sections/PageTitle";
import {
  getItemFromLocalizedDataArray,
  getItemsFromLocalizedDataArray,
  getLocalizedDataArray,
} from "services/data";
import getServerSideUser from "services/firebase/getServerSideUser";
import {
  GameCard,
  Event,
  GameUnit,
  Scout,
  GameRegion,
  GameCharacter,
} from "types/game";
import { QuerySuccess } from "types/makotools";
import { CardCard } from "components/core/CardCard";
import ResponsiveGrid from "components/core/ResponsiveGrid";
import { useCollections } from "services/makotools/collection";
import NewCollectionModal from "pages/cards/components/NewCollectionModal";
import RegionInfo from "components/sections/RegionInfo";
import useUser from "services/firebase/user";

function Page({
  event,
  scouts,
  cardsQuery,
  unitsQuery,
  charactersQuery,
  region,
}: {
  event: Event;
  scouts: Scout[];
  cardsQuery: QuerySuccess<GameCard[]>;
  unitsQuery: QuerySuccess<GameUnit[]>;
  charactersQuery: QuerySuccess<GameCharacter[]>;
  region: GameRegion;
}) {
  const { t } = useTranslation("events__event");
  const theme = useMantineTheme();
  let allCards = useMemo(() => cardsQuery.data, [cardsQuery.data]);
  let allUnits = useMemo(() => unitsQuery.data, [unitsQuery.data]);
  let allCharacters = useMemo(
    () => charactersQuery.data,
    [charactersQuery.data]
  );
  const { user } = useUser();
  const { collections, editCollection, createCollection } = useCollections(
    user?.id
  );
  const [newCollectionModalOpened, setNewCollectionModalOpened] =
    useState<boolean>(false);

  const cards = allCards.filter((card) => {
    return event.cards?.includes(card.id);
  });

  const units = allUnits.filter(
    (unit: GameUnit) => event.unit_id && event.unit_id.includes(unit.id)
  );

  let contentItems = [
    {
      id: "#cards",
      name: t("cards"),
      icon: <IconCards size={16} strokeWidth={3} />,
    },
    {
      id: "#story",
      name: t("story"),
      icon: <IconBook size={16} strokeWidth={3} />,
    },
    {
      id: "#scout",
      name: t("scout"),
      icon: <IconDiamond size={16} strokeWidth={3} />,
    },
  ];

  if (
    event.type !== "tour" &&
    event.type !== "spotlight" &&
    event.type !== "merge"
  )
    contentItems.splice(contentItems.length - 1, 0, {
      id: "#song",
      name: t("events:song"),
      icon: <IconMusic size={16} strokeWidth={3} />,
    });

  return (
    <>
      <RegionInfo region={region} />
      <PageTitle
        title={event.name.filter((name) => name !== null)[0]}
        sx={{ flex: "1 0 80%" }}
        space={theme.spacing.lg}
        {...{ region }}
      />
      <ESPageHeader content={event} units={units} region={region} />
      <SectionTitle title="Cards" id="cards" Icon={IconCards} />
      <ResponsiveGrid width={224}>
        {cards.map((card: GameCard) => (
          <CardCard
            key={card.id}
            card={card}
            cardOptions={{ showFullInfo: true }}
            collections={collections}
            lang={cardsQuery.lang}
            editCollection={editCollection}
            onNewCollection={() => setNewCollectionModalOpened(true)}
            character={
              allCharacters.find(
                (char) => char.character_id === card.character_id
              ) as GameCharacter
            }
            gameRegion={region}
          />
        ))}
      </ResponsiveGrid>
      <SectionTitle title={t("story")} id="story" Icon={IconBook} />
      <Stories content={event} />
      {event.type !== "tour" &&
        event.type !== "spotlight" &&
        event.type !== "merge" && (
          <>
            <SectionTitle title={t("song")} id="song" Icon={IconVinyl} />
            <Paper p="sm" withBorder>
              <Text align="center" color="dimmed" size="sm" weight={700}>
                {t("comingSoon")}
              </Text>
            </Paper>
          </>
        )}
      {scouts &&
        scouts.map((s: Scout) => (
          <>
            <SectionTitle
              title={t("scoutTitle", {
                scout: s.name.filter((name) => name !== null)[0],
              })}
              id="scout"
              Icon={IconDiamond}
            />
            <ScoutPointsSummary
              id={s.gacha_id}
              type={event.type}
              eventName={event.name.filter((name) => name !== null)[0]}
              scoutName={s.name.filter((name) => name !== null)[0]}
              banner={s.banner_id}
            />
          </>
        ))}
      {!!scouts?.length && <PointsTable />}
      <NewCollectionModal
        // use key to reset internal form state on close
        key={JSON.stringify(newCollectionModalOpened)}
        opened={newCollectionModalOpened}
        onClose={() => setNewCollectionModalOpened(false)}
        createCollection={createCollection}
      />
    </>
  );
}

export const getServerSideProps = getServerSideUser(
  async ({ res, locale, params, db, user }) => {
    if (!params?.id || Array.isArray(params?.id)) return { notFound: true };

    const validRegions: GameRegion[] = ["en", "jp", "cn", "kr", "tw"];

    let region = params.region?.[0] as GameRegion;
    const isRegionEmpty = !region;

    if (!region && user && db && db?.setting__game_region) {
      region = db.setting__game_region as GameRegion;
    }
    if (!validRegions.includes(region)) {
      // redirect to page with valid region
      region = "en";
      return {
        redirect: {
          destination: `/events/${params.id}/${region}`,
          permanent: false,
        },
      };
    }
    if (isRegionEmpty) {
      // redirect to page with region
      return {
        redirect: {
          destination: `/events/${params.id}/${region}`,
          permanent: false,
        },
      };
    }
    const getEvents: any = await getLocalizedDataArray<Event>(
      "events",
      locale,
      "event_id"
    );

    const getEvent: any = getItemFromLocalizedDataArray<Event>(
      getEvents,
      parseInt(params.id),
      "event_id"
    );

    if (getEvent.status === "error") return { notFound: true };

    const getScouts: any = await getLocalizedDataArray<Scout>(
      "scouts",
      locale,
      "gacha_id"
    );

    const getScoutsArray = getItemsFromLocalizedDataArray<Scout>(
      getScouts,
      !getEvent.data.gacha_id.length
        ? [+getEvent.data.gacha_id]
        : getEvent.data.gacha_id,
      "gacha_id"
    );

    const getUnits = await getLocalizedDataArray("units", locale, "id");

    const cards = await getLocalizedDataArray<GameCard>("cards", locale, "id", [
      "id",
      "name",
      "title",
      "type",
      "rarity",
      "stats.ir.da",
      "stats.ir.vo",
      "stats.ir.pf",
      "stats.ir4.da",
      "stats.ir4.vo",
      "stats.ir4.pf",
      "character_id",
    ]);

    const characters = await getLocalizedDataArray(
      "characters",
      locale,
      "character_id",
      ["character_id", "first_name"]
    );

    const event = getEvent.data;
    const scouts = getScoutsArray
      .map((scout) => scout.data)
      .filter((scout) => scout !== null);
    const title = event.name[0] ?? String(event.event_id);
    const breadcrumbs = ["events", title];

    return {
      props: {
        event: event,
        scouts: scouts,
        cardsQuery: cards,
        unitsQuery: getUnits,
        charactersQuery: characters,
        title,
        breadcrumbs,
        bookmarkId: event.event_id,
        region,
      },
    };
  }
);

Page.getLayout = getLayout({});
export default Page;
