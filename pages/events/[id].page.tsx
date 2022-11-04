import {
  Alert,
  Blockquote,
  Box,
  Divider,
  Group,
  Paper,
  SimpleGrid,
  Space,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import {
  IconBook,
  IconCards,
  IconDiamond,
  IconList,
  IconMusic,
  IconStar,
} from "@tabler/icons";
import { useMemo } from "react";
import Link from "next/link";

import gachaCardEventBonus from "../../data/gachaCardEventBonus.json";

import ESPageHeader from "./components/ESPageHeader";
import Contents from "./components/Contents";

import Picture from "components/core/Picture";
import { getLayout } from "components/Layout";
import PageTitle from "components/sections/PageTitle";
import {
  getItemFromLocalizedDataArray,
  getLocalizedDataArray,
} from "services/data";
import getServerSideUser from "services/firebase/getServerSideUser";
import { useDayjs } from "services/libraries/dayjs";
import { GameCard, GameEvent, GameUnit, ScoutEvent } from "types/game";
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
  console.log(event);
  cards = cards.filter((card) => {
    return (
      event.five_star?.card_id.includes(card.id) ||
      event.four_star?.card_id.includes(card.id) ||
      event.three_star?.card_id.includes(card.id)
    );
  });

  units = units.filter(
    (unit: GameUnit) => event.unit_id && event.unit_id.includes(unit.id)
  );
  console.log(cards);

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
      <Space h="xl" />
      <Space h="xl" />
      <Contents items={contentItems} />
      <Space h="xl" />
      <Space h="xl" />
      <Group>
        <IconCards size={25} strokeWidth={3} color="#fcc419" />{" "}
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
      <Group>
        <IconBook size={25} strokeWidth={3} color="#9775fa" />
        <Title id="story" order={2}>
          Story
        </Title>
      </Group>
      <Space h="sm" />
      <Divider />
      <Space h="md" />
      <Group align="flex-start" sx={{ padding: "10px" }}>
        <Box sx={{ position: "relative", flex: "1 2 45%" }}>
          <Picture
            alt={event.name[0]}
            srcB2={`assets/card_still_full1_${event.banner_id}_normal.png`}
            sx={{ height: 200 }}
            radius="sm"
          />
        </Box>
        <Box sx={{ flex: "2 1 50%" }}>
          <Stack>
            <Title order={3}>{event.story_name && event.story_name[0]}</Title>
            <Blockquote
              sx={(theme) => ({
                fontSize: "12pt",
                fontStyle: "italic",
                color:
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[2]
                    : theme.colors.gray[6],
              })}
            >
              {event.intro_lines && event.intro_lines[0]}
            </Blockquote>
            <Text align="right" size="sm" color="dimmed">
              Story written by {event.story_author && event.story_author[0]}{" "}
              {event.intro_lines_tl_credits &&
                `| Summary translated by ${(
                  <Text
                    component={Link}
                    color="indigo"
                    href={`https://twitter.com/${event.intro_lines_tl_credits[0]}`}
                  >
                    @{event.intro_lines_tl_credits[0]}
                  </Text>
                )}`}
            </Text>
          </Stack>
        </Box>
      </Group>
      <Space h="md" />
      <Title id="chapters" order={3}>
        <Group align="center">
          <IconList size={24} strokeWidth={2} /> Story Chapters
        </Group>
      </Title>
      <Space h="sm" />
      <Paper shadow="xs" p="md" withBorder>
        Coming soon!
      </Paper>
      <Space h="xl" />
      {event.type !== "tour" && (
        <>
          <Space h="xl" />
          <Group>
            <IconMusic size={25} strokeWidth={3} color="#94d82d" />
            <Title id="song" order={2}>
              Song
            </Title>
          </Group>
          <Space h="sm" />
          <Divider />
          <Space h="md" />
          <Paper shadow="xs" p="md" withBorder>
            Coming soon!
          </Paper>
        </>
      )}
      <Space h="xl" />
      {scout && (
        <>
          <Space h="xl" />
          <Group align="flex-start">
            <IconDiamond size={25} strokeWidth={3} color="#66d9e8" />
            <Title id="scout" order={2}>
              Scout! {scout.name[0]}
            </Title>
          </Group>
          <Space h="sm" />
          <Divider />
          <Space h="md" />
          <Group>
            <Box sx={{ position: "relative", flex: "1 1 40%" }}>
              <Link href={`/scouts/${scout.gacha_id}`}>
                <Picture
                  alt={scout.name[0]}
                  srcB2={`assets/card_still_full1_${scout.banner_id}_evolution.png`}
                  sx={{ height: 100 }}
                  radius="sm"
                />
              </Link>
            </Box>
            <Box sx={{ flex: "1 1 55%" }}>
              <Alert variant="outline" color="indigo" sx={{ minHeight: 100 }}>
                <Text size="md">
                  Cards in the <strong>{scout.name[0]}</strong> scout offer a
                  point bonus for this event!
                </Text>
              </Alert>
            </Box>
          </Group>
          <Space h="lg" />
          <Paper withBorder shadow="xs" p="xl">
            <Table striped captionSide="bottom">
              <caption>
                The event bonus range is based on the number of copies of a card
                owned. One copy of a card offers the minimum bonus in a range
                while owning five or more copies offers the maximum bonus.
              </caption>
              <thead>
                <tr>
                  <th>Card rarity</th>
                  <th>Event point bonus</th>
                </tr>
              </thead>
              {gachaCardEventBonus.map((row) => (
                <tr key={row.rarity}>
                  <td>
                    {row.rarity}
                    <IconStar size={10} />
                  </td>
                  <td>
                    {row.minBonus}% - {row.maxBonus}%
                  </td>
                </tr>
              ))}
            </Table>
          </Paper>
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
