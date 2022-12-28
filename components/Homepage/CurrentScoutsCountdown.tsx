import {
  Badge,
  Container,
  createStyles,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useState, useEffect } from "react";

import Picture from "components/core/Picture";
import { countdown, toCountdownReadable } from "services/events";
import { useDayjs } from "services/libraries/dayjs";
import { Scout } from "types/game";

const useStyles = createStyles((theme, _params) => ({
  scoutsContainer: {
    marginTop: "3vh",
  },
  scoutsCards: {
    marginTop: "2vh",
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

function ScoutCard({ scout }: { scout: Scout }) {
  const { t } = useTranslation("home");
  const { classes } = useStyles();
  return (
    <Paper
      withBorder
      component={Link}
      href={`/scouts/${scout.gacha_id}`}
      shadow="xs"
      radius="md"
      p="md"
    >
      <Group noWrap>
        <Picture
          alt={scout.name[0]}
          srcB2={`assets/card_still_full1_${scout.banner_id}_evolution.webp`}
          sx={{
            width: 100,
            height: 100,
            maxHeight: 100,
          }}
          radius="xl"
        />
        <Stack>
          <Group>
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
        </Stack>
      </Group>
    </Paper>
  );
}

function CurrentScoutsCards({ scouts }: { scouts: Scout[] }) {
  const { classes } = useStyles();

  return (
    <SimpleGrid
      cols={scouts.length}
      className={classes.scoutsCards}
      breakpoints={[{ maxWidth: 755, cols: 1, spacing: "sm" }]}
    >
      {scouts.map((scout: Scout) => (
        <ScoutCard key={scout.gacha_id} scout={scout} />
      ))}
    </SimpleGrid>
  );
}

function CurrentScoutsCountdown({ scouts }: { scouts: Scout[] }) {
  const theme = useMantineTheme();
  const { t } = useTranslation("home");
  const { dayjs } = useDayjs();
  const { classes } = useStyles();
  const currentScouts: Scout[] = scouts.filter((scout) => {
    return dayjs(new Date()).isBetween(
      dayjs(scout.start_date),
      dayjs(scout.end_date)
    );
  });
  return (
    <Container className={classes.scoutsContainer}>
      <Group align="end">
        <Title order={2}>{t("scout.current")}</Title>
        <Text
          color={
            theme.colorScheme === "dark"
              ? theme.colors[theme.primaryColor][3]
              : theme.colors[theme.primaryColor][6]
          }
          component={Link}
          href="/scouts"
        >
          {t("scout.seeAll")}
        </Text>
      </Group>
      <CurrentScoutsCards scouts={currentScouts} />
    </Container>
  );
}

export default CurrentScoutsCountdown;
