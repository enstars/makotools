import {
  Badge,
  Blockquote,
  Box,
  Group,
  Paper,
  Space,
  Stack,
  Tabs,
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
  IconStar,
} from "@tabler/icons";
import { useMemo } from "react";

import attributes from "../../data/attributes.json";

import Picture from "components/core/Picture";
import { getLayout } from "components/Layout";
import PageTitle from "components/sections/PageTitle";
import {
  getItemFromLocalizedDataArray,
  getLocalizedDataArray,
} from "services/data";
import { retrieveEvent } from "services/events";
import getServerSideUser from "services/firebase/getServerSideUser";
import { useDayjs } from "services/libraries/dayjs";
import { GameCard, GameEvent, GameUnit, ID } from "types/game";
import { QuerySuccess } from "types/makotools";
import IconEnstars from "components/core/IconEnstars";

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
      event.five_star?.card_id === card.id ||
      event.four_star?.card_id === card.id
    );
  });

  units = units.filter(
    (unit: GameUnit) =>
      (event.unit_id as ID[]).includes(unit.id) || event.unit_id === unit.id
  );
  console.log(cards);

  return (
    <>
      <Group position="apart" align="baseline">
        <Stack>
          <PageTitle title={event.name} sx={{ width: "100%" }} />
          <Box sx={{ position: "relative", flex: "1 1 70%" }}>
            <Picture
              alt={event.name}
              srcB2={`assets/card_still_full1_${event.banner_id}_evolution.png`}
              sx={{ height: 180 }}
              radius="md"
            />
          </Box>
        </Stack>
        <Box sx={{ flex: "1 1 25%" }}>
          <Group noWrap>
            <Space w="sm" />
            <Text size="md" weight={600} sx={{ flex: "1 2 0" }}>
              {dayjs(event.start_date).format("lll")}
              {" — "}
              {dayjs(event.end_date).format("lll z")}
            </Text>
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
          </Group>
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
            {event.intro_lines}
          </Blockquote>
          <Group noWrap>
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
      <Space h="md" />
      <Tabs variant="outline" defaultValue="cards">
        <Tabs.List>
          <Tabs.Tab
            value="cards"
            icon={<IconCards size={16} strokeWidth={3} />}
          >
            Cards
          </Tabs.Tab>
          {event.type === "song" && (
            <Tabs.Tab
              value="song"
              icon={<IconMusic size={16} strokeWidth={3} />}
            >
              Song
            </Tabs.Tab>
          )}
          <Tabs.Tab value="story" icon={<IconBook strokeWidth={3} />}>
            Story
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="cards" sx={{ padding: "15px" }}>
          <Stack>
            {cards.map((card: GameCard) => (
              <Group key={card.id}>
                <Group
                  sx={(theme) => ({
                    width: 300,
                    border: `4px solid ${
                      theme.colors[attributes[card.type].color][7]
                    }`,
                    borderRadius: theme.radius.md,
                    position: "relative",

                    ["@media (max-width: 768px)"]: {
                      margin: "auto",
                    },
                  })}
                >
                  <Group
                    noWrap
                    spacing="xs"
                    sx={(theme) => ({
                      position: "absolute",
                      bottom: 0,
                      padding: "5px",
                      background: theme.colors[attributes[card.type].color][7],
                      zIndex: 3,
                      borderRadius: `0px ${theme.radius.sm}px 0px 0px`,
                    })}
                  >
                    {[...Array(card.rarity)].map((star, i) => (
                      <IconStar key={i} size={16} color="white" fill="white" />
                    ))}
                  </Group>
                  <Group spacing={3} noWrap>
                    {["normal", "evolution"].map((type) => (
                      <Box key={type} sx={{ position: "relative", width: 145 }}>
                        <Picture
                          alt={card.title[0]}
                          srcB2={
                            card.rarity >= 4
                              ? `assets/card_still_full1_${card.id}_${type}.png`
                              : `assets/card_rectangle4_${card.id}_${type}.png`
                          }
                          radius="sm"
                          sx={(theme) => ({
                            height: 250,
                            flex: "1 1 100%",
                            transition: theme.other.transition,
                          })}
                        />
                      </Box>
                    ))}
                  </Group>
                </Group>
                <Paper
                  shadow="xs"
                  p="md"
                  withBorder
                  sx={{
                    flex: "1 1 50%",
                    ["@media (min-width: 960px)"]: {
                      height: 250,
                      minHeight: 250,
                    },
                  }}
                >
                  <Title order={4}>{card.title[0]}</Title>
                  <Text size="md">{card.name[0]}</Text>
                </Paper>
              </Group>
            ))}
          </Stack>
        </Tabs.Panel>
        {event.type === "song" && <Tabs.Panel value="song" />}
        <Tabs.Panel value="story" />
      </Tabs>
    </>
  );
}

export const getServerSideProps = getServerSideUser(
  async ({ res, locale, params }) => {
    if (!params?.id || Array.isArray(params?.id)) return { notFound: true };

    const getEvents: any = await getLocalizedDataArray(
      "events",
      locale,
      "event_id"
    );

    console.log(params.id);

    const getEvent = getItemFromLocalizedDataArray(
      getEvents,
      parseInt(params.id),
      "event_id"
    );

    const getUnits = await getLocalizedDataArray("units", locale, "id");

    if (getEvent.status === "error") return { notFound: true };

    let event: GameEvent = retrieveEvent(getEvent.data, locale);

    const cards = await getLocalizedDataArray<GameCard>("cards", locale, "id", [
      "id",
      "name",
      "title",
      "type",
      "rarity",
    ]);

    const title = event.name;
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
