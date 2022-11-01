import { Card, createStyles, Text, Title } from "@mantine/core";
import Link from "next/link";

import Picture from "components/core/Picture";
import { useDayjs } from "services/libraries/dayjs";
import { ScoutEvent } from "types/game";

const useStyles = createStyles((theme, _params, getRef) => ({
  scoutInfo: {
    padding: "10px",

    "&:link": {
      color: "inherit",
      textDecoration: "none",
    },

    "&:visited": {
      color: "inherit",
    },
  },
  scoutDates: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[2]
        : theme.colors.gray[6],
  },
}));

function ScoutCard({ scout }: { scout: ScoutEvent }) {
  const { dayjs } = useDayjs();
  const { classes } = useStyles();

  return (
    <Card withBorder>
      <Card.Section
        component={Link}
        href={`/scouts/${scout.gacha_id}`}
        sx={{ position: "relative" }}
      >
        <Picture
          alt={scout.name}
          srcB2={`assets/card_still_full1_${scout.banner_id}_evolution.png`}
          sx={{ height: 100 }}
        />
      </Card.Section>
      <Card.Section
        component={Link}
        href={`/scouts/${scout.gacha_id}`}
        className={classes.scoutInfo}
      >
        <Title order={4}>SCOUT! {scout.name}</Title>
        <Text size="sm" className={classes.scoutDates}>
          {dayjs(scout.start_date).format("ll")}
          {" - "}
          {dayjs(scout.end_date).format("ll")}
        </Text>
      </Card.Section>
    </Card>
  );
}

export default ScoutCard;
