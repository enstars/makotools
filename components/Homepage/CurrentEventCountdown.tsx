import {
  createStyles,
  Group,
  Title,
  Text,
  Paper,
  Box,
  Button,
  Stack,
  useMantineTheme,
} from "@mantine/core";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import Link from "next/link";
import useTranslation from "next-translate/useTranslation";

import Picture from "components/core/Picture";
import {
  countdown,
  isItYippeeTime,
  retrieveClosestEvents,
  toCountdownReadable,
} from "services/events";
import { useDayjs } from "services/libraries/dayjs";
import { GameEvent } from "types/game";

const useStyles = createStyles((theme, _params) => ({
  eventContainer: {
    marginTop: "2vh",
  },

  eventImage: {
    minWidth: "350px",
    maxWidth: "400px",
  },

  link: {
    "&:link": {
      color: theme.primaryColor,
      textDecoration: "none",
    },
    "&:visited": {
      color: theme.primaryColor,
    },
  },
}));

function EventImage({ event }: { event: GameEvent }) {
  const { classes } = useStyles();
  return (
    <Link href={`/events/${event.event_id}`}>
      <Picture
        alt={event.name[0]}
        srcB2={`assets/card_still_full1_${event.banner_id}_evolution.webp`}
        sx={{ width: 300, height: 175 }}
        radius="lg"
      />
    </Link>
  );
}

function Countdown({
  date,
  status,
}: {
  date: string;
  status: "start" | "end";
}) {
  const { t } = useTranslation("home");
  const [countdownAmt, setCountdownAmt] = useState<string>();
  useEffect(() => {
    const interval = setInterval(() => {
      let ctdwn = countdown(new Date(date), new Date());
      setCountdownAmt(toCountdownReadable(ctdwn));
    }, 1000);
    return () => clearInterval(interval);
  }, [date]);
  return (
    <Group>
      <Text weight={600}>
        {status === "start" ? t("event.start") : t("event.end")}
      </Text>
      <Title order={4}>{countdownAmt}</Title>
    </Group>
  );
}

function CurrentEventCountdown({ events }: { events: GameEvent[] }) {
  const theme = useMantineTheme();
  const { t } = useTranslation("home");
  const { dayjs } = useDayjs();

  const [noWrap, setNoWrap] = useState<boolean>(true);
  const [yippeeTime, setYippeeTime] = useState<boolean>(false);

  useEffect(() => {
    window.innerWidth < 900 ? setNoWrap(false) : setNoWrap(true);
  }, []);

  const { classes } = useStyles();

  let currentEvent: GameEvent = events.filter((event) => {
    return dayjs(new Date()).isBetween(
      dayjs(event.start_date),
      dayjs(event.end_date)
    );
  })[0];

  let nextEvent: GameEvent | null = !currentEvent
    ? (retrieveClosestEvents(events, 1)[0] as GameEvent)
    : null;

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentEvent) {
        setYippeeTime(
          isItYippeeTime(new Date(currentEvent.end_date), new Date(), dayjs)
        );
      }
      if (nextEvent) {
        setYippeeTime(
          isItYippeeTime(new Date(nextEvent.start_date), new Date(), dayjs)
        );
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [currentEvent, nextEvent, dayjs]);

  return (
    <Box>
      <Group align="end">
        <Title order={2}>
          {currentEvent ? t("event.current") : t("event.next")}
        </Title>
        <Text
          color={
            theme.colorScheme === "dark"
              ? theme.colors[theme.primaryColor][3]
              : theme.colors[theme.primaryColor][6]
          }
          component={Link}
          href="/events"
        >
          {t("event.seeAll")}
        </Text>
      </Group>
      <Paper
        shadow="xs"
        radius="md"
        p="lg"
        withBorder
        className={classes.eventContainer}
      >
        {yippeeTime && <Confetti recycle={false} />}
        {currentEvent ? (
          <Group noWrap={noWrap} align="flex-start" spacing="xl">
            <EventImage event={currentEvent} />
            <Stack justify="space-around">
              <Box>
                <Title order={3} sx={{ maxWidth: "300px" }}>
                  {currentEvent.name[0]}
                </Title>
                <Countdown date={currentEvent.end_date} status="end" />
              </Box>
              <Button color={theme.primaryColor} disabled>
                {t("event.eventCalculator")}
              </Button>
            </Stack>
          </Group>
        ) : nextEvent ? (
          <Group noWrap={noWrap} align="flex-start" spacing="xl">
            <EventImage event={nextEvent} />
            <Stack justify="space-around">
              <Box>
                <Title order={3} sx={{ maxWidth: "300px" }}>
                  {nextEvent.name[0]}
                </Title>
                <Countdown date={nextEvent.start_date} status="start" />
              </Box>
              <Button color={theme.primaryColor} disabled>
                {t("event.eventCalculator")}
              </Button>
            </Stack>
          </Group>
        ) : (
          <Text size="lg" weight={600}>
            No upcoming events.
          </Text>
        )}
      </Paper>
    </Box>
  );
}

export default CurrentEventCountdown;
