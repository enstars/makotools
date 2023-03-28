import { useEffect, useMemo, useState } from "react";
import {
  ActionIcon,
  Divider,
  Group,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import {
  IconBook,
  IconBookmark,
  IconCards,
  IconMedal,
} from "@tabler/icons-react";
import { useListState } from "@mantine/hooks";

import PageTitle from "components/sections/PageTitle";
import {
  getItemFromLocalizedDataArray,
  getLocalizedDataArray,
} from "services/data";
import getServerSideUser from "services/firebase/getServerSideUser";
import { GameCard, GameCharacter, Event, Scout } from "types/game";
import { QuerySuccess, UserLoggedIn } from "types/makotools";
import { getLayout } from "components/Layout";
import { CardCard } from "components/core/CardCard";
import ESPageHeader from "pages/events/components/ESPageHeader";
import PointsTable from "pages/events/components/PointsTable";
import Stories from "pages/events/components/Stories";
import SectionTitle from "pages/events/components/SectionTitle";
import ResponsiveGrid from "components/core/ResponsiveGrid";
import { useCollections } from "services/makotools/collection";
import NewCollectionModal from "pages/cards/components/NewCollectionModal";
import useUser from "services/firebase/user";
import useTranslation from "next-translate/useTranslation";

function Page({
  scout,
  event,
  charactersQuery,
  cardsQuery,
}: {
  scout: Scout;
  event: Event | null;
  charactersQuery: QuerySuccess<GameCharacter[]>;
  cardsQuery: QuerySuccess<GameCard[]>;
}) {
  const { t } = useTranslation("events__event");
  const user = useUser();
  const theme = useMantineTheme();
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

  const [bookmarks, handlers] = useListState<number>(
    (user as UserLoggedIn).db.bookmarks__scouts || []
  );

  useEffect(() => {
    user.loggedIn &&
      user.db.set({
        bookmarks__scouts: bookmarks,
      });
  }, [bookmarks]);

  return (
    <>
      <Group>
        <PageTitle title={scout.name[0]} sx={{ flex: "1 0 80%" }} />
        <Tooltip
          label={
            user.loggedIn
              ? bookmarks.includes(scout.gacha_id)
                ? t("events:event.removeBookmark")
                : t("events:event.addBookmark")
              : t("loginBookmark")
          }
          position="bottom"
        >
          <ActionIcon
            size={60}
            disabled={!user.loggedIn}
            onClick={() => {
              bookmarks.includes(scout.gacha_id)
                ? handlers.remove(bookmarks.indexOf(scout.gacha_id))
                : handlers.append(scout.gacha_id);
            }}
          >
            <IconBookmark
              size={60}
              fill={
                bookmarks.includes(scout.gacha_id)
                  ? theme.colors[theme.primaryColor][4]
                  : "none"
              }
              strokeWidth={bookmarks.includes(scout.gacha_id) ? 0 : 1}
            />
          </ActionIcon>
        </Tooltip>
      </Group>
      <ESPageHeader content={scout} />
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
  async ({ res, locale, params }) => {
    if (!params?.id || Array.isArray(params?.id)) return { notFound: true };

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
    const breadcrumbs = ["scouts", title];

    return {
      props: {
        scout: scout,
        event: event,
        charactersQuery: characters,
        cardsQuery: cards,
        title,
        breadcrumbs,
      },
    };
  }
);

Page.getLayout = getLayout({});
export default Page;
