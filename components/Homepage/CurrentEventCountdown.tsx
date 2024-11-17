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
import Trans from "next-translate/Trans";

import Picture from "components/core/Picture";
import {
  countdown,
  isItYippeeTime,
  toCountdownReadable,
} from "services/campaigns";
import { useDayjs } from "services/libraries/dayjs";
import { Event } from "types/game";

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

function EventImage({ event }: { event: Event }) {
  if (!event) return <></>;
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
      {status === "start" ? (
        <Trans
          i18nKey="home:event.start"
          components={[
            <Text weight={600} key="text" />,
            <Title order={4} key="time" />,
          ]}
          values={{ time: countdownAmt }}
        />
      ) : (
        <Trans
          i18nKey="home:event.end"
          components={[
            <Text weight={600} key="text" />,
            <Title order={4} key="time" />,
          ]}
          values={{ time: countdownAmt }}
        />
      )}
    </Group>
  );
}

function CurrentEventCountdown({ events }: { events: Event[] }) {
  const theme = useMantineTheme();
  const { t } = useTranslation("home");
  const { dayjs } = useDayjs();

  const [yippeeTime, setYippeeTime] = useState<boolean>(false);

  const { classes } = useStyles();

  const shownEvent = events.filter((event) => {
    return dayjs().isBefore(event.end.en);
  })[0];
  const isNextEvent = shownEvent && dayjs().isBefore(shownEvent.start.en);

  useEffect(() => {
    if (!shownEvent) return;
    const interval = setInterval(() => {
      if (isNextEvent) {
        setYippeeTime(
          isItYippeeTime(new Date(shownEvent.start.en), new Date(), dayjs)
        );
      } else {
        setYippeeTime(
          isItYippeeTime(new Date(shownEvent.end.en), new Date(), dayjs)
        );
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [shownEvent, dayjs, isNextEvent]);

  return (
    <Box>
      <Group align="end">
        <Title order={2}>
          {isNextEvent ? t("event.next") : t("event.current")}
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
        <Group
          sx={{
            [`@media (max-width: 800px)`]: {
              flexWrap: "wrap",
            },
          }}
          align="flex-start"
          spacing="xl"
        >
          <EventImage event={shownEvent} />
          <Stack justify="space-around">
            {shownEvent && (
              <Box>
                <Title order={3} sx={{ maxWidth: "300px" }}>
                  {shownEvent.name[0]}
                </Title>

                {isNextEvent ? (
                  <Countdown date={shownEvent.start.en} status="start" />
                ) : (
                  <Countdown date={shownEvent.end.en} status="end" />
                )}
              </Box>
            )}
            <Button
              color={theme.primaryColor}
              component="a"
              href="/event-calculator"
            >
              {t("event.eventCalculator")}
            </Button>
          </Stack>
        </Group>
      </Paper>
    </Box>
  );
}

export default CurrentEventCountdown;
