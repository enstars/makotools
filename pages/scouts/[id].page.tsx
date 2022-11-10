import { useMemo } from "react";
import { Group, Space, Divider, SimpleGrid, Title } from "@mantine/core";
import { IconBook, IconCards, IconMedal } from "@tabler/icons";

import PageTitle from "components/sections/PageTitle";
import {
  getItemFromLocalizedDataArray,
  getLocalizedDataArray,
} from "services/data";
import getServerSideUser from "services/firebase/getServerSideUser";
import { GameCard, GameCharacter, GameEvent, ID, ScoutEvent } from "types/game";
import { QuerySuccess } from "types/makotools";
import { getLayout } from "components/Layout";
import CardCard from "pages/cards/components/DisplayCard";
import ESPageHeader from "pages/events/components/ESPageHeader";
import Contents from "pages/events/components/Contents";
import PointsTable from "pages/events/components/PointsTable";
import Stories from "pages/events/components/Stories";

function Page({
  scout,
  event,
  charactersQuery,
  cardsQuery,
}: {
  scout: ScoutEvent;
  event: GameEvent | null;
  charactersQuery: QuerySuccess<GameCharacter[]>;
  cardsQuery: QuerySuccess<GameCard[]>;
}) {
  let characters = useMemo(() => charactersQuery.data, [charactersQuery.data]);
  let cards = useMemo(() => cardsQuery.data, [cardsQuery.data]);

  cards = cards.filter((card) => scout.cards?.includes(card.id));

  characters = characters.filter((character) => {
    return cards
      .map((card) => card.character_id)
      .includes(character.character_id);
  });

  let contentItems = [
    {
      id: "#cards",
      name: "Cards",
      icon: <IconCards size={16} strokeWidth={3} />,
    },
    {
      id: "#story",
      name: "Story",
      icon: <IconBook size={16} strokeWidth={3} />,
    },
    {
      id: "#event",
      name: "Event",
      icon: <IconMedal size={16} strokeWidth={3} />,
    },
  ];

  return (
    <>
      <PageTitle
        title={`${scout.type === "scout" ? "SCOUT!" : ""} ${scout.name[0]}`}
      />
      <ESPageHeader content={scout} />
      {scout.type === "scout" && (
        <>
          <Space h="xl" />
          <Space h="xl" />
          <Contents items={contentItems} />
        </>
      )}
      <Space h="xl" />
      <Space h="xl" />
      <Group>
        <IconCards size={25} strokeWidth={3} color="#ffd43b" />{" "}
        <Title id="cards" order={2}>
          Cards
        </Title>
      </Group>
      <Space h="sm" />
      <Divider />
      <Space h="md" />
      <SimpleGrid cols={2} breakpoints={[{ maxWidth: 400, cols: 1 }]}>
        {cards.map((card: GameCard) => (
          <CardCard
            key={card.id}
            cardOptions={{ showFullInfo: true }}
            card={card}
            lang={cardsQuery.lang}
          />
        ))}
      </SimpleGrid>
      <Space h="xl" />
      <Space h="xl" />
      {scout.story_name && (
        <>
          <Group>
            <IconBook size={25} strokeWidth={3} color="#b197fc" />
            <Title id="story" order={2}>
              {scout.type === "scout" ? "Story" : "Featured Story"}
            </Title>
          </Group>
          <Space h="sm" />
          <Divider />
          <Space h="md" />
          <Stories content={scout} />
          <Space h="xl" />
        </>
      )}
      {scout.type === "scout" && (
        <>
          <Space h="xl" />
          {event && (
            <>
              <Group align="flex-start">
                <IconMedal size={25} strokeWidth={3} color="#66d9e8" />
                <Title id="event" order={2}>
                  Event
                </Title>
              </Group>
              <Space h="sm" />
              <Divider />
              <Space h="md" />
              <PointsTable
                id={event.event_id}
                type={event.type}
                eventName={event.name[0]}
                scoutName={scout.name[0]}
                banner={event.banner_id as ID}
              />
            </>
          )}
          <Space h="xl" />
        </>
      )}
    </>
  );
}

export const getServerSideProps = getServerSideUser(
  async ({ res, locale, params }) => {
    if (!params?.id || Array.isArray(params?.id)) return { notFound: true };

    const getScouts = await getLocalizedDataArray<ScoutEvent>(
      "scouts",
      locale,
      "gacha_id"
    );

    const getScout = getItemFromLocalizedDataArray<ScoutEvent>(
      getScouts,
      parseInt(params.id),
      "gacha_id"
    );

    if (getScout.status === "error") return { notFound: true };

    let getEvents, getEvent;

    if (getScout.data.event_id) {
      getEvents = await getLocalizedDataArray<GameEvent>(
        "events",
        locale,
        "event_id"
      );

      getEvent = getItemFromLocalizedDataArray<GameEvent>(
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
    ]);

    const scout: ScoutEvent = getScout.data;
    const event: GameEvent | null = getEvent?.data || null;
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
