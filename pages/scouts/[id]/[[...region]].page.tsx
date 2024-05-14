import { useMemo, useState } from "react";
import { Divider } from "@mantine/core";
import { IconBook, IconCards, IconMedal } from "@tabler/icons-react";
import useTranslation from "next-translate/useTranslation";

import PageTitle from "components/sections/PageTitle";
import {
  getItemFromLocalizedDataArray,
  getLocalizedDataArray,
} from "services/data";
import getServerSideUser from "services/firebase/getServerSideUser";
import { GameCard, GameCharacter, Event, Scout, GameRegion } from "types/game";
import { QuerySuccess } from "types/makotools";
import { getLayout } from "components/Layout";
import { CardCard } from "components/core/CardCard";
import ESPageHeader from "pages/events/components/ESPageHeader";
import PointsTable from "pages/events/components/PointsTable";
import Stories from "pages/events/components/Stories";
import SectionTitle from "pages/events/components/SectionTitle";
import ResponsiveGrid from "components/core/ResponsiveGrid";
import { useCollections } from "services/makotools/collection";
import NewCollectionModal from "pages/cards/components/NewCollectionModal";
import RegionInfo from "components/sections/RegionInfo";

function Page({
  scout,
  event,
  charactersQuery,
  cardsQuery,
  region,
}: {
  scout: Scout;
  event: Event | null;
  charactersQuery: QuerySuccess<GameCharacter[]>;
  cardsQuery: QuerySuccess<GameCard[]>;
  region: GameRegion;
}) {
  const { t } = useTranslation("events__event");
  let characters = useMemo(() => charactersQuery.data, [charactersQuery.data]);
  let cards = useMemo(() => cardsQuery.data, [cardsQuery.data]);
  const { collections, onEditCollection, onNewCollection } = useCollections();
  const [newCollectionModalOpened, setNewCollectionModalOpened] =
    useState<boolean>(false);

  cards = cards.filter((card) => scout.cards?.includes(card.id));

  characters = characters.filter((character) => {
    return cards
      .map((card) => card.character_id)
      .includes(character.character_id);
  });

  return (
    <>
      <PageTitle
        title={scout.name[0]}
        sx={{ flex: "1 0 80%" }}
        region={region}
      />
      <RegionInfo region={region} />
      <ESPageHeader content={scout} region={region} />
      <SectionTitle title="Cards" id="cards" Icon={IconCards} />
      <ResponsiveGrid width={224}>
        {cards.map((card: GameCard) => (
          <CardCard
            key={card.id}
            card={card}
            cardOptions={{ showFullInfo: true }}
            collections={collections}
            lang={cardsQuery.lang}
            onEditCollection={onEditCollection}
            onNewCollection={() => setNewCollectionModalOpened(true)}
            character={
              characters.find(
                (character) => character.character_id === card.character_id
              ) as GameCharacter
            }
            gameRegion={region}
          />
        ))}
      </ResponsiveGrid>
      <Divider my="md" />
      {scout.story_name && (
        <>
          <SectionTitle
            title={scout.type === "scout" ? "Story" : "Featured Story"}
            id="story"
            Icon={IconBook}
          />
          <Stories content={scout} />
          <Divider my="md" />
        </>
      )}
      {scout.type === "scout" && (
        <>
          {event && (
            <>
              <SectionTitle title="Event" id="event" Icon={IconMedal} />
              <PointsTable
                id={event.event_id}
                type={scout.type}
                eventName={event.name[0]}
                scoutName={scout.name[0]}
                banner={event.banner_id}
              />
            </>
          )}
        </>
      )}
      <NewCollectionModal
        // use key to reset internal form state on close
        key={JSON.stringify(newCollectionModalOpened)}
        opened={newCollectionModalOpened}
        onClose={() => setNewCollectionModalOpened(false)}
        onNewCollection={onNewCollection}
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
          destination: `/scouts/${params.id}/${region}`,
          permanent: false,
        },
      };
    }
    if (isRegionEmpty) {
      // redirect to page with region
      return {
        redirect: {
          destination: `/scouts/${params.id}/${region}`,
          permanent: false,
        },
      };
    }

    const getScouts = await getLocalizedDataArray<Scout>(
      "scouts",
      locale,
      "gacha_id"
    );

    const getScout = getItemFromLocalizedDataArray<Scout>(
      getScouts,
      parseInt(params.id),
      "gacha_id"
    );

    if (getScout.status === "error") return { notFound: true };

    let getEvents, getEvent;

    if (getScout.data.event_id) {
      getEvents = await getLocalizedDataArray<Event>(
        "events",
        locale,
        "event_id"
      );

      getEvent = getItemFromLocalizedDataArray<Event>(
        getEvents,
        getScout.data.event_id,
        "event_id"
      );
    }

    const characters = await getLocalizedDataArray<GameCharacter>(
      "characters",
      locale,
      "character_id"
    );

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

    const scout: Scout = getScout.data;
    const event: Event | null = getEvent?.data || null;
    const title = scout.name[0];
    const breadcrumbs = ["scouts", `${scout.gacha_id}[ID]${title}`];

    return {
      props: {
        scout: scout,
        event: event,
        charactersQuery: characters,
        cardsQuery: cards,
        region,
        title,
        breadcrumbs,
        bookmarkId: scout.gacha_id,
        meta: {
          title: title,
        },
      },
    };
  }
);

Page.getLayout = getLayout({});
export default Page;
