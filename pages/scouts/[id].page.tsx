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
} from "@mantine/core";
import dayjs from "dayjs";
import { IconBook, IconCards, IconMedal } from "@tabler/icons";
import Link from "next/link";

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
      {scout.type === "scout" && (
        <>
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
                    <Link
                      href={`https://twitter.com/${scout.intro_lines_tl_credits}`}
                    >
                      @{scout.intro_lines_tl_credits}
                    </Link>
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
          <Group>
            <IconMedal size={25} strokeWidth={3} color="#99e9f2" />
            <Title order={2}>Event</Title>
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

Page.getLayout = getLayout({ wide: true });
export default Page;
