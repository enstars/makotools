import {
  Badge,
  Container,
  createStyles,
  Group,
  Loader,
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
import Trans from "next-translate/Trans";

import Picture from "components/core/Picture";
import { countdown, toCountdownReadable } from "services/campaigns";
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
  return countdownAmt ? (
    <Group>
      <Trans
        i18nKey="home:event.end"
        components={[
          <Text weight={500} key="text" />,
          <Text weight={700} key="countdown" />,
        ]}
        values={{ time: countdownAmt }}
      />
    </Group>
  ) : (
    <Loader variant="dots" />
  );
}

function ScoutCard({ scout }: { scout: Scout }) {
  const { t } = useTranslation("home");
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
            <Title order={4}>{t("scout.fs", { name: scout.name[0] })}</Title>
            <Badge
              variant="filled"
              color={scout.type === "scout" ? "violet" : "lightblue"}
            >
              {scout.type === "scout" ? "event scout" : scout.type}
            </Badge>
          </Group>
          <Countdown endDate={scout.end.en} />
        </Stack>
      </Group>
    </Paper>
  );
}

function CurrentScoutsCards({ scouts }: { scouts: Scout[] }) {
  const { classes } = useStyles();

  return (
    <SimpleGrid
      className={classes.scoutsCards}
      breakpoints={[
        { maxWidth: 755, cols: 1, spacing: "sm" },
        { minWidth: 755, cols: 2, spacing: "sm" },
      ]}
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
      dayjs(scout.start.en),
      dayjs(scout.end.en)
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
