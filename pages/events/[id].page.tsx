import { Divider, Paper, Text } from "@mantine/core";
import {
  IconBook,
  IconCards,
  IconDiamond,
  IconMusic,
  IconVinyl,
} from "@tabler/icons";
import { useMemo } from "react";

import ESPageHeader from "./components/ESPageHeader";
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
import { GameCard, Event, GameUnit, ID, Scout } from "types/game";
import { QuerySuccess } from "types/makotools";
import CardCard from "pages/cards/components/DisplayCard";
import ResponsiveGrid from "components/core/ResponsiveGrid";

type Colors = "red" | "blue" | "yellow" | "green";

function Page({
  event,
  scout,
  cardsQuery,
  unitsQuery,
}: {
  event: Event;
  scout: Scout;
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
      <SectionTitle title="Cards" id="cards" Icon={IconCards} />
      <ResponsiveGrid width={224}>
        {cards.map((card: GameCard) => (
          <CardCard
            key={card.id}
            cardOptions={{ showFullInfo: true }}
            card={card}
            lang={cardsQuery.lang}
          />
        ))}
      </ResponsiveGrid>
      <Divider my="md" />
      <SectionTitle title="Story" id="story" Icon={IconBook} />
      <Stories content={event} />
      <Divider my="md" />
      {event.type !== "tour" && (
        <>
          <SectionTitle title="Song" id="song" Icon={IconVinyl} />
          <Paper p="sm" withBorder>
            <Text align="center" color="dimmed" size="sm" weight={700}>
              Coming soon!
            </Text>
          </Paper>
          <Divider my="md" />
        </>
      )}
      {scout && (
        <>
          <SectionTitle
            title={`Scout! ${scout.name[0]}`}
            id="scout"
            Icon={IconDiamond}
          />
          <PointsTable
            id={scout.gacha_id}
            type={event.type}
            eventName={event.name[0]}
            scoutName={scout.name[0]}
            banner={scout.banner_id as ID}
          />
        </>
      )}
    </>
  );
}

export const getServerSideProps = getServerSideUser(
  async ({ res, locale, params }) => {
    if (!params?.id || Array.isArray(params?.id)) return { notFound: true };

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

    const getScout = getItemFromLocalizedDataArray<Scout>(
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
      "stats.ir.da",
      "stats.ir.vo",
      "stats.ir.pf",
      "stats.ir4.da",
      "stats.ir4.vo",
      "stats.ir4.pf",
      "character_id",
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
