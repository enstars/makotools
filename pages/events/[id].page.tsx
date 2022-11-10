import { Divider, Paper, SimpleGrid, Space } from "@mantine/core";
import { IconBook, IconCards, IconDiamond, IconMusic } from "@tabler/icons";
import { useMemo } from "react";

import ESPageHeader from "./components/ESPageHeader";
import Contents from "./components/Contents";
import PointsTable from "./components/PointsTable";
import Stories from "./components/Stories";
import SectionTitle from "./components/SectionTitle";

import { getLayout } from "components/Layout";
import PageTitle from "components/sections/PageTitle";
import {
  getItemFromLocalizedDataArray,
  getLocalizedDataArray,
} from "services/data";
import getServerSideUser from "services/firebase/getServerSideUser";
import { useDayjs } from "services/libraries/dayjs";
import { GameCard, GameEvent, GameUnit, ID, ScoutEvent } from "types/game";
import { QuerySuccess } from "types/makotools";
import CardCard from "pages/cards/components/DisplayCard";

type Colors = "red" | "blue" | "yellow" | "green";

function Page({
  event,
  scout,
  cardsQuery,
  unitsQuery,
}: {
  event: GameEvent;
  scout: ScoutEvent;
  cardsQuery: QuerySuccess<GameCard[]>;
  unitsQuery: QuerySuccess<GameUnit[]>;
}) {
  let cards = useMemo(() => cardsQuery.data, [cardsQuery.data]);
  let units = useMemo(() => unitsQuery.data, [unitsQuery.data]);
  const { dayjs } = useDayjs();

  cards = cards.filter((card) => {
    return event.cards?.includes(card.id);
  });

  units = units.filter(
    (unit: GameUnit) => event.unit_id && event.unit_id.includes(unit.id)
  );

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
      id: "#scout",
      name: "Scout",
      icon: <IconDiamond size={16} strokeWidth={3} />,
    },
  ];

  if (event.type !== "tour")
    contentItems.splice(contentItems.length - 1, 0, {
      id: "#song",
      name: "Song",
      icon: <IconMusic size={16} strokeWidth={3} />,
    });

  return (
    <>
      <PageTitle title={event.name[0]} sx={{ width: "100%" }} />
      <ESPageHeader content={event} units={units} />
      <Space h={50} />
      <Contents items={contentItems} />
      <Space h="xl" />
      <SectionTitle title="Cards" id="cards" icon={<IconCards size={70} />} />
      <SimpleGrid
        cols={2}
        breakpoints={[{ maxWidth: 400, cols: 1 }]}
        sx={{ marginBottom: "50px" }}
      >
        {cards.map((card: GameCard) => (
          <CardCard
            key={card.id}
            cardOptions={{ showFullInfo: true }}
            card={card}
            lang={cardsQuery.lang}
          />
        ))}
      </SimpleGrid>
      <Divider />
      <SectionTitle title="Story" id="story" icon={<IconBook size={70} />} />
      <Stories content={event} />
      <Divider />
      {event.type !== "tour" && (
        <>
          <SectionTitle title="Song" id="song" icon={<IconMusic size={70} />} />
          <Paper shadow="xs" p="md" withBorder sx={{ marginBottom: "50px" }}>
            Coming soon!
          </Paper>
          <Divider />
        </>
      )}
      {scout && (
        <>
          <SectionTitle
            title={`Scout! ${scout.name[0]}`}
            id="scout"
            icon={<IconDiamond size={70} />}
          />
          <PointsTable
            id={scout.gacha_id}
            type={event.type}
            eventName={event.name[0]}
            scoutName={scout.name[0]}
            banner={scout.banner_id as ID}
          />
          <Space h={50} />
        </>
      )}
    </>
  );
}

export const getServerSideProps = getServerSideUser(
  async ({ res, locale, params }) => {
    if (!params?.id || Array.isArray(params?.id)) return { notFound: true };

    const getEvents: any = await getLocalizedDataArray<GameEvent>(
      "events",
      locale,
      "event_id"
    );

    const getEvent: any = getItemFromLocalizedDataArray<GameEvent>(
      getEvents,
      parseInt(params.id),
      "event_id"
    );

    if (getEvent.status === "error") return { notFound: true };

    const getScouts: any = await getLocalizedDataArray<ScoutEvent>(
      "scouts",
      locale,
      "gacha_id"
    );

    const getScout = getItemFromLocalizedDataArray<ScoutEvent>(
      getScouts,
      getEvent.data.gacha_id as number,
      "gacha_id"
    );

    if (getScout.status === "error") return { notFound: true };

    const getUnits = await getLocalizedDataArray("units", locale, "id");

    const cards = await getLocalizedDataArray<GameCard>("cards", locale, "id", [
      "id",
      "name",
      "title",
      "type",
      "rarity",
    ]);

    const event = getEvent.data;
    const scout = getScout.data;
    const title = event.name[0];
    const breadcrumbs = ["events", title];

    return {
      props: {
        event: event,
        scout: scout,
        cardsQuery: cards,
        unitsQuery: getUnits,
        title,
        breadcrumbs,
      },
    };
  }
);

Page.getLayout = getLayout({});
export default Page;
