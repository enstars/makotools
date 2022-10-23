import {
  Container,
  createStyles,
  Group,
  Image,
  Title,
  Text,
  Paper,
  Box,
  Button,
  Stack,
} from "@mantine/core";
import { useEffect, useState } from "react";

import { getAssetURL } from "services/data";
import {
  countdown,
  isEventHappeningToday,
  toCountdownReadable,
} from "services/events";
import { GameEvent } from "types/game";

const useStyles = createStyles((theme, _params) => ({
  eventContainer: {
    marginTop: "2vh",
  },

  eventImage: {
    minWidth: "350px",
    maxWidth: "400px",
  },
}));

function EventImage({ event }: { event: GameEvent }) {
  const { classes } = useStyles();

  return (
    <Image
      alt={event.name}
      src={getAssetURL(
        `assets/card_still_full1_${event.banner_id}_evolution.webp`
      )}
      className={classes.eventImage}
      radius="lg"
    />
  );
}

function Countdown({ event }: { event: GameEvent }) {
  const [countdownAmt, setCountdownAmt] = useState<string>();
  useEffect(() => {
    const interval = setInterval(() => {
      let ctdwn = countdown(new Date(event.end_date), new Date());
      setCountdownAmt(toCountdownReadable(ctdwn));
    }, 1000);
    return () => clearInterval(interval);
  }, [event.end_date]);
  return (
    <Group>
      <Text weight={600}>Ends in </Text>
      <Title order={4}>{countdownAmt}</Title>
    </Group>
  );
}

function CurrentEventCountdown({ events }: { events: GameEvent[] }) {
  const [noWrap, setNoWrap] = useState<boolean>(true);

  useEffect(() => {
    window.innerWidth < 900 ? setNoWrap(false) : setNoWrap(true);
  }, []);

  const { classes } = useStyles();

  let currentEvent: GameEvent = events.filter((event) =>
    isEventHappeningToday(event)
  )[0];
  return (
    <Container>
      <Title order={2}>Current Event</Title>
      <Paper
        shadow="xs"
        radius="md"
        p="lg"
        withBorder
        className={classes.eventContainer}
      >
        {currentEvent ? (
          <Group noWrap={noWrap} align="flex-start" spacing="xl">
            <EventImage event={currentEvent} />
            <Stack justify="space-around">
              <Box>
                <Title order={3} sx={{ maxWidth: "300px" }}>
                  {currentEvent.name}
                </Title>
                <Countdown event={currentEvent} />
              </Box>
              <Button color="indigo" disabled>
                Event Calculator
              </Button>
            </Stack>
          </Group>
        ) : (
          <Text size="lg" weight={600}>
            No event is currently taking place.
          </Text>
        )}
      </Paper>
    </Container>
  );
}

export default CurrentEventCountdown;
