import {
  Alert,
  Container,
  Paper,
  Image,
  Text,
  Title,
  useMantineTheme,
  Group,
  Stack,
  Button,
  Tooltip,
  Box,
  SimpleGrid,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconArrowRight,
  IconCalendarDue,
  IconHeart,
  IconStar,
} from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import useTranslation from "next-translate/useTranslation";
import { Carousel } from "@mantine/carousel";
import { useElementSize, useMediaQuery } from "@mantine/hooks";
import Trans from "next-translate/Trans";

import { countdown, retrieveNextCampaigns } from "services/campaigns";
import useUser from "services/firebase/user";
import {
  Birthday,
  GameCharacter,
  Event,
  Scout,
  GameUnit,
  Campaign,
} from "types/game";
import { useDayjs } from "services/libraries/dayjs";
import { getNameOrder } from "services/game";
import HokkeConcern from "assets/HokkeConcern.png";
import { UserLoggedIn } from "types/makotools";
import Picture from "components/core/Picture";

function RecommendedCard({
  event,
  faveChar,
  faveUnit,
  characters,
  units,
}: {
  event: Event | Scout | Birthday;
  faveChar?: number;
  faveUnit?: number;
  characters: GameCharacter[];
  units: GameUnit[];
}) {
  const { dayjs } = useDayjs();
  const user = useUser();
  const { t } = useTranslation("home");
  const theme = useMantineTheme();
  const [countdownAmt, setCountdownAmt] = useState<string>();
  useEffect(() => {
    const interval = setInterval(() => {
      let ctdwn = countdown(new Date(event.start.en), new Date());
      const d = Math.floor(ctdwn / 86400000);
      const h = Math.floor((ctdwn % 86400000) / 3600000);
      const m = Math.floor(((ctdwn % 86400000) % 3600000) / 60000);
      const s = Math.floor((((ctdwn % 86400000) % 3600000) % 60000) / 1000);
      setCountdownAmt(
        d === 0 && h === 0 && m === 0
          ? `${s} ${s === 1 ? "sec" : "secs"}`
          : d === 0 && h === 0
          ? `${m} ${m === 1 ? "min" : "mins"}`
          : d === 0
          ? `${h} ${h === 1 ? "hr" : "hrs"}`
          : `${d} ${d === 1 ? "day" : "days"}`
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [event.start.en]);

  function returnCharOrUnitName(): string {
    if (faveChar) {
      let char = characters.filter((c) => c.character_id === faveChar)[0];
      let nameObj = {
        first_name: char.first_name[0],
        last_name: char.last_name[0],
      };
      return getNameOrder(
        nameObj,
        (user as UserLoggedIn).db?.setting__name_order
      );
    } else {
      return units.filter((u) => u.id === faveUnit)[0].name[0];
    }
  }

  let link = (event as Birthday).character_id
    ? `/characters/${(event as Birthday).character_id}`
    : ((event as Event).event_id && event.type === "song") ||
      event.type === "shuffle" ||
      event.type == "tour"
    ? `/events/${(event as Event).event_id}`
    : `/scouts/${(event as Scout).gacha_id}`;
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Text size="xs" color="dimmed" sx={{ display: "flex" }}>
        <IconStar size={12} style={{ marginTop: 2 }} />
        <Text inherit ml={4}>
          {t("recommended.becauseYouLike")}{" "}
          <Text weight={700} component="span">
            {returnCharOrUnitName()}
          </Text>
        </Text>
      </Text>
      <Paper
        withBorder
        shadow="xs"
        component={Link}
        href={
          event.type === "birthday"
            ? `/characters/${event.character_id}`
            : event.type === "feature scout" || event.type === "scout"
            ? `/scouts/${event.gacha_id}`
            : `/events/${event.event_id}`
        }
        mt={8}
        sx={{ flexGrow: 1, display: "flex", height: 96 }}
      >
        <Picture
          alt={event.name[0]}
          srcB2={`assets/card_still_full1_${event.banner_id}_${
            event.type === "birthday" ? "normal" : "evolution"
          }.webp`}
          sx={{ width: 90, alignSelf: "stretch", flexShrink: 0 }}
        />
        <Stack spacing={0} py="xs" px="sm">
          <Text weight={700} lineClamp={2}>
            {event.type === "birthday"
              ? `${
                  event.name[0].split(" ")[1] !== undefined
                    ? event.name[0].split(" ")[1]
                    : event.name[0].split(" ")[0]
                }'s Birthday`
              : event.name[0]}
          </Text>
          <Group spacing={3} align="center">
            <IconCalendarDue size={16} />
            <Tooltip
              label={dayjs(event.start.en).format("MMMM DD YYYY")}
              position="bottom"
            >
              <Text size="sm" weight={500}>
                {t("event.start")} {countdownAmt}
              </Text>
            </Tooltip>
          </Group>
        </Stack>
      </Paper>
    </Box>
  );
}

function RecommendedSlide({
  events,
  eventsSlide,
  characters,
  units,
  slideColumns,
  slideRows,
}: {
  events: any[];
  eventsSlide: Event[];
  characters: GameCharacter[];
  units: GameUnit[];
  slideColumns: number;
  slideRows: number;
}) {
  const { dayjs } = useDayjs();
  return (
    <SimpleGrid cols={slideColumns} sx={{ gap: "8px 16px" }}>
      {eventsSlide
        .filter((e) => dayjs(e.start.en).isAfter(dayjs()))
        .map((e: Event | Scout | Birthday, i) => (
          <RecommendedCard
            key={i}
            event={events[events.findIndex((ev: any) => ev.event === e)].event}
            faveChar={
              events[events.findIndex((ev: any) => ev.event === e)].charId
            }
            faveUnit={
              events[events.findIndex((ev: any) => ev.event === e)].unitId
            }
            characters={characters}
            units={units}
          />
        ))}
    </SimpleGrid>
  );
}

function RecommendedCountdown({
  events,
  characters,
  units,
}: {
  events: {
    event: Campaign;
    charId?: number;
    unitId?: number;
  }[];
  characters: GameCharacter[];
  units: GameUnit[];
}) {
  const { t } = useTranslation("home");
  const user = useUser();
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.xs}px)`);
  const { ref, width, height } = useElementSize();
  const slideColumns = width > 0 ? Math.floor(width / 240) : 1;
  const slideRows = Math.ceil(12 / slideColumns);

  const getOnlyEvents = (events: any[]): (Event | Scout | Birthday)[] => {
    let entries = Object.entries(events);
    let returnArray: (Event | Scout | Birthday)[] = [];

    entries.forEach((entry) => returnArray.push(entry[1].event));
    return returnArray;
  };

  let slidesArr: any[] = [];

  const sortedEvents = retrieveNextCampaigns(
    getOnlyEvents(events),
    events.length
  );

  for (
    let i = 0;
    i < sortedEvents.length && i < 24;
    i += slideColumns * slideRows
  ) {
    let slide = sortedEvents.slice(i, i + slideColumns * slideRows);
    slidesArr.push(slide);
  }

  return (
    <Container my="xl" ref={ref}>
      <Title order={2}>{t("recommended.title")}</Title>
      <Alert my={3} icon={<IconHeart />}>
        {t("recommended.recommendedAlert")}
      </Alert>
      {user.loggedIn &&
      user.db &&
      (!user.db.profile__fave_charas ||
        user.db.profile__fave_charas.length === 0) ? (
        <Paper p={15} my={10}>
          <Text>
            <Trans
              i18nKey="home:recommended.noRecommendations"
              components={[
                <Text
                  key="link"
                  color={theme.colors[theme.primaryColor][4]}
                  component={Link}
                  href={`/@${user.db.username}`}
                />,
              ]}
            />
          </Text>
        </Paper>
      ) : (user as UserLoggedIn).db.profile__fave_charas &&
        (user as UserLoggedIn).db.profile__fave_charas.length &&
        (user as UserLoggedIn).db.profile__fave_charas[0] === -1 ? (
        <Box mt={10}>
          <Group noWrap mb={10}>
            <Image
              src={HokkeConcern.src}
              alt="Hokke is concerned."
              width={80}
              sx={{ pointerEvents: "none" }}
              mt={5}
            />
            <Stack>
              <Paper withBorder py={20} pl={15} pr={40}>
                <Text component="span">
                  {t("recommended.sadHokke", {
                    random:
                      Math.floor(Math.random() * 2) === 0
                        ? t("recommended.akehoshi")
                        : t("recommended.yuuki"),
                  })}
                </Text>
              </Paper>
              <Text size="xs" color="dimmed">
                {t("recommended.explanation")}
              </Text>
            </Stack>
          </Group>
        </Box>
      ) : events.length === 0 ? (
        <Paper p={20} my={10}>
          <Text>{t("recommended.unavailable")}</Text>
        </Paper>
      ) : (
        <Carousel
          loop
          my="sm"
          orientation={isMobile ? "vertical" : "horizontal"}
          height={122 * slideRows + 8 * (slideRows - 1)}
          withControls={!isMobile}
          controlSize={40}
          controlsOffset="xs"
          nextControlIcon={
            <Button
              variant="default"
              rightIcon={<IconArrowRight />}
              styles={(theme) => ({
                icon: {
                  color: theme.colors[theme.primaryColor][4],
                },
                label: {
                  color: theme.colors[theme.primaryColor][4],
                },
              })}
            >
              {t("next")}
            </Button>
          }
          previousControlIcon={
            <Button
              variant="default"
              leftIcon={<IconArrowLeft />}
              styles={(theme) => ({
                icon: {
                  color: theme.colors[theme.primaryColor][4],
                },
                label: {
                  color: theme.colors[theme.primaryColor][4],
                },
              })}
            >
              {t("prev")}
            </Button>
          }
          align={isMobile ? "start" : "center"}
          styles={(theme) => ({
            controls: {
              position: "static",
              padding: 0,
              paddingTop: theme.spacing.xs,
              display: slideColumns > 1 ? "flex" : "none",
            },
            control: {
              border: "none",
              background: "none",
            },
          })}
        >
          {slidesArr.map((slide, i) => {
            return (
              <Carousel.Slide key={i}>
                <RecommendedSlide
                  events={events}
                  eventsSlide={slide}
                  characters={characters}
                  units={units}
                  slideColumns={slideColumns}
                  slideRows={slideRows}
                />
              </Carousel.Slide>
            );
          })}
        </Carousel>
      )}
    </Container>
  );
}

export default RecommendedCountdown;
