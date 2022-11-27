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
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useState, useEffect } from "react";

import { getAssetURL } from "services/data";
import { countdown, toCountdownReadable } from "services/events";
import { useDayjs } from "services/libraries/dayjs";
import { ScoutEvent } from "types/game";

const useStyles = createStyles((theme, _params) => ({
  scoutsContainer: {
    marginTop: "3vh",
  },
  scoutsCards: {
    marginTop: "2vh",
  },
  link: {
    "&:link": {
      color:
        theme.colorScheme === "dark"
          ? theme.colors.indigo[2]
          : theme.colors.indigo[6],
      textDecoration: "none",
    },
    "&:visited": {
      color:
        theme.colorScheme === "dark"
          ? theme.colors.indigo[2]
          : theme.colors.indigo[6],
    },
  },
}));

function Countdown({ endDate }: { endDate: string }) {
  const { t } = useTranslation("home");
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
      <Text weight={500}>{t("scout.end")}</Text>
      <Text weight={700}>{countdownAmt}</Text>
    </Group>
  );
}

function ScoutCard({ scout }: { scout: ScoutEvent }) {
  const { t } = useTranslation("home");
  const { classes } = useStyles();
  return (
    <Card
      shadow="xs"
      p="md"
      radius="md"
      withBorder
      component={Link}
      href={`/scouts/${scout.gacha_id}`}
    >
      <Card.Section>
        <Image
          alt={scout.name[0]}
          src={getAssetURL(
            `assets/card_still_full1_${scout.banner_id}_evolution.webp`
          )}
        />
      </Card.Section>
      <Group sx={{ padding: "5px" }}>
        <Title order={4}>
          {scout.type === "scout"
            ? t("scout.scout", { name: scout.name[0] })
            : t("scout.fs", { name: scout.name[0] })}
        </Title>
        <Badge
          variant="filled"
          color={scout.type === "scout" ? "violet" : "lightblue"}
        >
          {scout.type === "scout" ? "event scout" : scout.type}
        </Badge>
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
  const { t } = useTranslation("home");
  const { dayjs } = useDayjs();
  const { classes } = useStyles();
  const currentScouts: ScoutEvent[] = scouts.filter((scout) => {
    return dayjs(new Date()).isBetween(
      dayjs(scout.start_date),
      dayjs(scout.end_date)
    );
  });
  return (
    <Container className={classes.scoutsContainer}>
      <Group align="end">
        <Title order={2}>{t("scout.current")}</Title>
        <Link href="/scouts" className={classes.link}>
          {t("scout.seeAll")}
        </Link>
      </Group>
      <CurrentScoutsCards scouts={currentScouts} />
    </Container>
  );
}

export default CurrentScoutsCountdown;
