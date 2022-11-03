import { Box, Card, createStyles, Text, Title } from "@mantine/core";
import Link from "next/link";
import { IconClockOff, IconHourglassHigh } from "@tabler/icons";

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
        {dayjs(scout.end_date).isBefore(dayjs()) && (
          <Box
            sx={(theme) => ({
              minWidth: "45%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
              position: "absolute",
              top: 0,
              right: 0,
              zIndex: 5,
              padding: "5px 10px",
              background:
                theme.colorScheme === "dark"
                  ? `${theme.colors.dark[7]}dd`
                  : `${theme.colors.gray[1]}ea`,
              borderRadius: `0px 0px 0px ${theme.radius.md}px`,
              color: theme.colorScheme === "dark" ? "#D3D6E0" : "#000",
            })}
          >
            <IconClockOff size={20} strokeWidth={2} />
            <Text
              weight={600}
              sx={(theme) => ({
                textTransform: "uppercase",
                letterSpacing: "1px",
              })}
            >
              Past
            </Text>
          </Box>
        )}
        {dayjs().isBetween(dayjs(scout.start_date), dayjs(scout.end_date)) && (
          <Box
            sx={(theme) => ({
              minWidth: "35%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
              position: "absolute",
              top: 0,
              right: 0,
              zIndex: 5,
              padding: "5px 10px",
              background:
                theme.colorScheme === "dark"
                  ? `${theme.colors.lime[8]}ea`
                  : `${theme.colors.lime[4]}ea`,
              borderRadius: `0px 0px 0px ${theme.radius.md}px`,
              color:
                theme.colorScheme === "dark"
                  ? theme.colors.gray[0]
                  : theme.colors.gray[9],
            })}
          >
            <IconHourglassHigh size={20} strokeWidth={2} />
            <Text
              weight={700}
              sx={(theme) => ({
                textTransform: "uppercase",
                letterSpacing: "1px",
              })}
            >
              Ongoing
            </Text>
          </Box>
        )}
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
        <Title order={4}>{scout.name[0]}</Title>
        <Text size="sm" className={classes.scoutDates}>
          {dayjs(scout.start_date).format("ll")}
          {" - "}
          {dayjs(scout.end_date).format("ll")}
        </Text>
        {/* {dayjs(scout.end_date).isBefore(dayjs()) && (
          <Badge color="gray">Past</Badge>
        )}
        {dayjs().isBetween(dayjs(scout.start_date), dayjs(scout.end_date)) && (
          <Badge variant="filled" color="yellow">
            Ongoing
          </Badge>
        )} */}
      </Card.Section>
    </Card>
  );
}

export default ScoutCard;
