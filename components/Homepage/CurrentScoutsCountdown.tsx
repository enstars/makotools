import {
  Badge,
  Card,
  Container,
  createStyles,
  Group,
  Image,
  SimpleGrid,
  Text,
  Title,
} from "@mantine/core";
import { useState, useEffect } from "react";

import { getAssetURL } from "services/data";
import {
  countdown,
  isEventHappeningToday,
  toCountdownReadable,
} from "services/events";
import { ScoutEvent } from "types/game";

const useStyles = createStyles((theme, _params) => ({
  scoutsContainer: {
    marginTop: "3vh",
  },
  scoutsCards: {
    marginTop: "2vh",
  },
  scoutsImage: {
    maxHeight: "130px",
    overflow: "clip",
  },
}));

function Countdown({ endDate }: { endDate: string }) {
  const [countdownAmt, setCountdownAmt] = useState<string>();
  useEffect(() => {
    const interval = setInterval(() => {
      let ctdwn = countdown(new Date(endDate), new Date());
      setCountdownAmt(toCountdownReadable(ctdwn));
    }, 1000);
    return () => clearInterval(interval);
  }, [endDate]);
  return (
    <Group>
      <Text weight={500}>Ends in </Text>
      <Text weight={700}>{countdownAmt}</Text>
    </Group>
  );
}

function ScoutCard({ scout }: { scout: ScoutEvent }) {
  const { classes } = useStyles();
  return (
    <Card shadow="xs" p="md" radius="md" withBorder>
      <Card.Section>
        <Image
          alt={scout.name}
          src={getAssetURL(
            `assets/card_still_full1_${scout.banner_id}_evolution.webp`
          )}
          height={300}
          className={classes.scoutsImage}
        />
      </Card.Section>
      <Group sx={{ padding: "5px" }}>
        <Text weight={600} size="lg">
          SCOUT! {scout.name}
        </Text>
        <Badge variant="light">{scout.type}</Badge>
      </Group>
      <Countdown endDate={scout.end_date} />
    </Card>
  );
}

function CurrentScoutsCards({ scouts }: { scouts: ScoutEvent[] }) {
  const { classes } = useStyles();

  return (
    <SimpleGrid
      cols={scouts.length}
      className={classes.scoutsCards}
      breakpoints={[{ maxWidth: 755, cols: 1, spacing: "sm" }]}
    >
      {scouts.map((scout: ScoutEvent) => (
        <ScoutCard key={scout.gacha_id} scout={scout} />
      ))}
    </SimpleGrid>
  );
}

function CurrentScoutsCountdown({ scouts }: { scouts: ScoutEvent[] }) {
  const { classes } = useStyles();
  const currentScouts: ScoutEvent[] = scouts.filter((scout) =>
    isEventHappeningToday(scout)
  );
  return (
    <Container className={classes.scoutsContainer}>
      <Title order={2}>Current Scouts</Title>
      <CurrentScoutsCards scouts={currentScouts} />
    </Container>
  );
}

export default CurrentScoutsCountdown;
