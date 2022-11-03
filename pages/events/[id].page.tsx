import {
  Badge,
  Blockquote,
  Box,
  Divider,
  Group,
  Paper,
  SimpleGrid,
  Space,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  IconArrowsShuffle2,
  IconBook,
  IconBus,
  IconCards,
  IconDiamond,
  IconMusic,
} from "@tabler/icons";
import { useMemo } from "react";

import Picture from "components/core/Picture";
import { getLayout } from "components/Layout";
import PageTitle from "components/sections/PageTitle";
import {
  getItemFromLocalizedDataArray,
  getLocalizedDataArray,
} from "services/data";
import getServerSideUser from "services/firebase/getServerSideUser";
import { useDayjs } from "services/libraries/dayjs";
import { GameCard, GameEvent, GameUnit, ID } from "types/game";
import { QuerySuccess } from "types/makotools";
import IconEnstars from "components/core/IconEnstars";
import CardCard from "pages/cards/components/DisplayCard";

type Colors = "red" | "blue" | "yellow" | "green";

function Page({
  event,
  cardsQuery,
  unitsQuery,
}: {
  event: GameEvent;
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
    (unit: GameUnit) =>
      (event.unit_id as ID[]).includes(unit.id) || event.unit_id === unit.id
  );
  console.log(cards);

  return (
    <>
      <PageTitle title={event.name[0]} sx={{ width: "100%" }} />
      <Group position="apart" align="flex-start">
        <Box sx={{ position: "relative", flex: "2 1 55%" }}>
          <Picture
            alt={event.name[0]}
            srcB2={`assets/card_still_full1_${event.banner_id}_evolution.png`}
            sx={{ height: 180 }}
            radius="md"
          />
        </Box>
        <Box sx={{ flex: "2 1 40%" }}>
          <Group>
            <Box sx={{ flex: "1 1 0", minWidth: 200 }}>
              <Text size="sm" color="dimmed" weight={700}>
                Start ({dayjs(event.start_date).format("z")})
              </Text>
              <Text size="lg" weight={500}>
                {dayjs(event.start_date).format("lll")}
              </Text>
            </Box>
            <Box sx={{ flex: "1 1 0", minWidth: 200 }}>
              <Text size="sm" color="dimmed" weight={700}>
                End ({dayjs(event.end_date).format("z")})
              </Text>
              <Text size="lg" weight={500}>
                {dayjs(event.end_date).format("lll")}
              </Text>
            </Box>
          </Group>
          <Space h="md" />
          <Group noWrap>
            {dayjs(event.end_date).isBefore(dayjs()) ? (
              <Badge color="gray">Past</Badge>
            ) : dayjs().isBetween(
                dayjs(event.start_date),
                dayjs(event.end_date)
              ) ? (
              <Badge color="yellow">Ongoing</Badge>
            ) : (
              <Badge color="lime">Upcoming</Badge>
            )}
            {units.map((unit) => (
              <Badge
                key={unit.id}
                color={unit.image_color}
                leftSection={<IconEnstars unit={unit.id} size={10} />}
                sx={{
                  background: unit.image_color,
                }}
                variant="filled"
              >
                {unit.name[0]}
              </Badge>
            ))}
            <Badge
              variant="filled"
              color={
                event.type === "song"
                  ? "grape"
                  : event.type === "shuffle"
                  ? "blue"
                  : "teal"
              }
              leftSection={
                <Box mt={4}>
                  {event.type === "song" ? (
                    <IconDiamond size={12} strokeWidth={3} />
                  ) : event.type === "shuffle" ? (
                    <IconArrowsShuffle2 size={12} strokeWidth={3} />
                  ) : (
                    <IconBus size={12} strokeWidth={3} />
                  )}
                </Box>
              }
            >
              {event.type}
            </Badge>
          </Group>
        </Box>
      </Group>
      <Space h={60} />
      <Group>
        <IconCards size={25} strokeWidth={3} color="#ffd43b" />{" "}
        <Title order={2}>Cards</Title>
      </Group>
      <Space h="sm" />
      <Divider />
      <Space h="md" />
      <SimpleGrid
        cols={4}
        breakpoints={[
          { maxWidth: 960, cols: 2 },
          { maxWidth: 400, cols: 1 },
        ]}
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
      <Space h="lg" />
      <Group>
        <IconBook size={25} strokeWidth={3} color="#b197fc" />
        <Title order={2}>Story</Title>
      </Group>
      <Space h="sm" />
      <Divider />
      <Space h="md" />
      <Group sx={{ padding: "10px" }}>
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
            <Text size="sm" color="dimmed">
              Story written by {event.story_author && event.story_author[0]}
            </Text>
          </Stack>
        </Box>
      </Group>
      <Space h="md" />
      <Title order={3}>Story Chapters</Title>
      <Space h="sm" />
      <Paper shadow="xs" p="md" withBorder>
        Coming soon!
      </Paper>
      <Space h="xl" />
      {event.type !== "tour" && (
        <>
          <Group>
            <IconMusic size={25} strokeWidth={3} color="#99e9f2" />
            <Title order={2}>Song</Title>
          </Group>
          <Space h="sm" />
          <Divider />
          <Space h="md" />
          <Paper shadow="xs" p="md" withBorder>
            Coming soon!
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

    console.log(params.id);

    const getEvent = getItemFromLocalizedDataArray<GameEvent>(
      getEvents,
      parseInt(params.id),
      "event_id"
    );

    const getUnits = await getLocalizedDataArray("units", locale, "id");

    if (getEvent.status === "error") return { notFound: true };

    const cards = await getLocalizedDataArray<GameCard>("cards", locale, "id", [
      "id",
      "name",
      "title",
      "type",
      "rarity",
    ]);

    const event = getEvent.data;
    const title = event.name[0];
    const breadcrumbs = ["events", title];

    return {
      props: {
        event: event,
        cardsQuery: cards,
        unitsQuery: getUnits,
        title,
        breadcrumbs,
      },
    };
  }
);

Page.getLayout = getLayout({ wide: true });
export default Page;
