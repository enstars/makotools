import { useMemo } from "react";
import {
  Group,
  Box,
  Space,
  Badge,
  Text,
  Divider,
  SimpleGrid,
  Title,
  Blockquote,
  Paper,
  Stack,
  Table,
  Alert,
  Accordion,
  List,
} from "@mantine/core";
import dayjs from "dayjs";
import { IconBook, IconCards, IconMedal, IconStar } from "@tabler/icons";
import Link from "next/link";

import gachaCardEventBonus from "../../data/gachaCardEventBonus.json";

import PageTitle from "components/sections/PageTitle";
import {
  getItemFromLocalizedDataArray,
  getLocalizedDataArray,
} from "services/data";
import getServerSideUser from "services/firebase/getServerSideUser";
import { GameCard, GameCharacter, GameEvent, ScoutEvent } from "types/game";
import { QuerySuccess } from "types/makotools";
import { getLayout } from "components/Layout";
import Picture from "components/core/Picture";
import CardCard from "pages/cards/components/DisplayCard";

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

  cards = cards.filter((card) => {
    return (
      scout.five_star?.card_id.includes(card.id) ||
      scout.four_star?.card_id.includes(card.id) ||
      scout.three_star?.card_id.includes(card.id)
    );
  });

  characters = characters.filter((character) => {
    return (
      scout.five_star?.chara_id.includes(character.character_id) ||
      scout.four_star?.chara_id.includes(character.character_id) ||
      scout.three_star?.chara_id.includes(character.character_id)
    );
  });

  console.log(event);

  return (
    <>
      <PageTitle
        title={`${
          scout.type === "scout"
            ? "SCOUT!"
            : scout.type === "feature scout"
            ? "Featured Scout:"
            : ""
        } ${scout.name[0]}`}
      />
      <Group position="apart" align="flex-start">
        <Box sx={{ position: "relative", flex: "2 1 55%" }}>
          <Picture
            alt={scout.name[0]}
            srcB2={`assets/card_still_full1_${scout.banner_id}_evolution.png`}
            sx={{ height: 180 }}
            radius="md"
          />
        </Box>
        <Box sx={{ flex: "2 1 40%" }}>
          <Group>
            <Box sx={{ flex: "1 1 0", minWidth: 200 }}>
              <Text size="sm" color="dimmed" weight={700}>
                Start ({dayjs(scout.start_date).format("z")})
              </Text>
              <Text size="lg" weight={500}>
                {dayjs(scout.start_date).format("lll")}
              </Text>
            </Box>
            <Box sx={{ flex: "1 1 0", minWidth: 200 }}>
              <Text size="sm" color="dimmed" weight={700}>
                End ({dayjs(scout.end_date).format("z")})
              </Text>
              <Text size="lg" weight={500}>
                {dayjs(scout.end_date).format("lll")}
              </Text>
            </Box>
          </Group>
          <Space h="md" />
          <Group noWrap>
            {dayjs(scout.end_date).isBefore(dayjs()) ? (
              <Badge color="gray">Past</Badge>
            ) : dayjs().isBetween(
                dayjs(scout.start_date),
                dayjs(scout.end_date)
              ) ? (
              <Badge color="yellow">Ongoing</Badge>
            ) : (
              <Badge color="lime">Upcoming</Badge>
            )}
          </Group>
        </Box>
      </Group>
      <Space h="xl" />
      <Space h="xl" />
      {scout.type === "scout" && (
        <>
          <Accordion
            variant="contained"
            defaultValue="contents"
            sx={{
              ["@media (min-width: 900px)"]: {
                width: "50%",
              },
            }}
          >
            <Accordion.Item value="contents">
              <Accordion.Control>
                <Title order={4}>Contents</Title>
              </Accordion.Control>
              <Accordion.Panel>
                <List size="md" spacing="sm" center>
                  <List.Item icon={<IconCards size={16} strokeWidth={3} />}>
                    <Text size="md" component={Link} href="#cards">
                      Cards
                    </Text>
                  </List.Item>
                  <List.Item icon={<IconMedal size={16} strokeWidth={3} />}>
                    <Text size="md" component={Link} href="#event">
                      Event
                    </Text>
                  </List.Item>
                  <List.Item icon={<IconBook size={16} strokeWidth={3} />}>
                    <Text size="md" component={Link} href="#story">
                      Story
                    </Text>
                  </List.Item>
                </List>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
          <Space h="xl" />
          <Space h="xl" />
        </>
      )}

      <Group>
        <IconCards size={25} strokeWidth={3} color="#ffd43b" />{" "}
        <Title id="cards" order={2}>
          Cards
        </Title>
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
      <Space h="xl" />
      {scout.type === "scout" && (
        <>
          <Space h="xl" />
          {event && (
            <>
              <Group align="flex-start">
                <IconMedal size={25} strokeWidth={3} color="#66d9e8" />
                <Title id="event" order={2}>
                  Event: {event.name[0]}
                </Title>
              </Group>
              <Space h="sm" />
              <Divider />
              <Space h="md" />
              <Group>
                <Box sx={{ position: "relative", flex: "1 1 40%" }}>
                  <Link href={`/events/${event.event_id}`}>
                    <Picture
                      alt={scout.name[0]}
                      srcB2={`assets/card_still_full1_${event.banner_id}_evolution.png`}
                      sx={{ height: 100 }}
                      radius="sm"
                    />
                  </Link>
                </Box>
                <Box sx={{ flex: "1 1 55%" }}>
                  <Alert
                    variant="filled"
                    color="indigo"
                    sx={{ minHeight: 100 }}
                  >
                    <Text size="md">
                      Cards in the <strong>{scout.name[0]}</strong> scout offer
                      an event point bonus for <strong>{event.name[0]}</strong>!
                    </Text>
                  </Alert>
                </Box>
              </Group>
              <Space h="lg" />
              <Paper withBorder shadow="xs" p="xl">
                <Table striped captionSide="bottom">
                  <caption>
                    The event bonus range is based on the number of copies of a
                    card you own. One copy of a card offers the minimum bonus in
                    a range while owning five or more copies offers the maximum
                    bonus.
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
          <Space h="xl" />
          <Space h="xl" />
          <Group>
            <IconBook size={25} strokeWidth={3} color="#b197fc" />
            <Title id="story" order={2}>
              Story
            </Title>
          </Group>
          <Space h="sm" />
          <Divider />
          <Space h="md" />
          <Group sx={{ padding: "10px" }}>
            <Box sx={{ position: "relative", flex: "1 2 45%" }}>
              <Picture
                alt={scout.name[0]}
                srcB2={`assets/card_still_full1_${scout.banner_id}_normal.png`}
                sx={{ height: 200 }}
                radius="sm"
              />
            </Box>
            <Box sx={{ flex: "2 1 50%" }}>
              <Stack>
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
                  {scout.intro_lines && scout.intro_lines[0]}
                </Blockquote>
                <Text size="sm" color="dimmed">
                  Summary translated by{" "}
                  {scout.intro_lines_tl_credits && (
                    <Text
                      color="indigo"
                      component={Link}
                      href={`https://twitter.com/${scout.intro_lines_tl_credits[0]}`}
                      target="_blank"
                    >
                      @{scout.intro_lines_tl_credits[0]}
                    </Text>
                  )}
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
