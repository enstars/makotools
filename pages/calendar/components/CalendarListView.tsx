import {
  createStyles,
  Container,
  Title,
  Card,
  CardSection,
  Image,
  Group,
  Text,
  Badge,
  Grid,
  Button,
  Stack,
} from "@mantine/core";
import { useState } from "react";
import { getMonthDays } from "@mantine/dates";
import {
  IconAlertCircle,
  IconCake,
  IconPlayerPlay,
  IconStar,
} from "@tabler/icons";
import Link from "next/link";

import { getB2File } from "../../../services/ensquare";
import { twoStarIDs } from "../../../data/characterIDtoCardID";

import CalendarHeader from "./CalendarHeader";

import { useDayjs } from "services/dayjs";
import { CalendarEvent } from "types/makotools";

const useStyles = createStyles((theme, _params, getRef) => ({
  listView: {
    maxWidth: "100%",
  },
  listBody: {
    maxWidth: "100%",
    margin: "auto",
    display: "grid",
    gridTemplateColumns: "auto auto auto",
    gap: "15px",
    alignContent: "start",

    [`@media (max-width: ${theme.breakpoints.md}px)`]: {
      display: "block",
    },
  },
  listDay: {
    breakInside: "avoid",
  },
  listDayTitle: {
    marginBottom: "1vh",
  },
  listDayEvents: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[5]
        : theme.colors.gray[2],
    padding: "1vh 1vw",
    border: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
    borderRadius: theme.radius.md,
  },
  listEventCard: {
    marginTop: "1vh",
  },
  listEventCardImage: {
    width: "320px",
    minHeight: "125px",
    maxHeight: "150px",
    overflow: "clip",
  },
  listEventCardText: {
    padding: "1vh 1vw",
  },
  listEventCardButton: {
    margin: "auto",
    marginTop: "1vh",
  },
}));

function CalendarListEvent({ ...props }) {
  const { classes } = useStyles();

  return (
    <Card withBorder className={classes.listEventCard}>
      <Card.Section className={classes.listEventCardImage}>
        <Image
          src={getB2File(
            `assets/card_still_full1_${
              props.event.type === "birthday"
                ? props.event.render_id + "_normal"
                : props.event.render_id + "_evolution"
            }.webp`
          )}
          alt={props.event.name}
          height={280}
          sx={{ marginTop: "-50px" }}
        />
      </Card.Section>
      <Card.Section component="a" className={classes.listEventCardText}>
        <Stack justify="space-around" spacing="md">
          <Text size="lg" weight={600}>
            {props.event.type === "birthday"
              ? props.event.name.split(" ")[0] + "'s birthday"
              : props.event.name}
          </Text>
          <Group position="center" align="center">
            <Badge
              color={
                props.event.type === "birthday"
                  ? "cyan"
                  : props.event.type === "anniversary"
                  ? "yellow"
                  : props.event.status === "start"
                  ? "lime"
                  : "pink"
              }
              leftSection={
                props.event.type === "birthday" ? (
                  <IconCake size={16} style={{ marginTop: "3px" }} />
                ) : props.event.type === "anniversary" ? (
                  <IconStar size={16} style={{ marginTop: "3px" }} />
                ) : props.event.status === "start" ? (
                  <IconPlayerPlay size={16} style={{ marginTop: "3px" }} />
                ) : (
                  <IconAlertCircle size={17} style={{ marginTop: "4px" }} />
                )
              }
              sx={{ alignItems: "center", minWidth: "75px", maxWidth: "90px" }}
            >
              {props.event.type === "birthday"
                ? "Birth"
                : props.event.type === "anniversary"
                ? "Anni"
                : props.event.status === "start"
                ? "Start"
                : "End"}
            </Badge>
            {props.event.type !== "anniversary" && (
              <Link
                href={
                  props.event.type === "birthday" ||
                  props.event.type === "feature scout"
                    ? `/characters/${props.event.id}`
                    : `/events/${props.event.id}`
                }
              >
                <Button
                  component="a"
                  className={classes.listEventCardButton}
                  color="indigo"
                  variant="subtle"
                  compact
                >
                  {props.event.type === "birthday" ||
                  props.event.type === "feature scout"
                    ? "Visit character page"
                    : "Visit event page"}
                </Button>
              </Link>
            )}
          </Group>
        </Stack>
      </Card.Section>
    </Card>
  );
}

function CalendarListDay({ ...props }) {
  const { classes } = useStyles();
  return (
    <Container className={classes.listDay}>
      <Title order={2} className={classes.listDayTitle}>
        {props.date}
        {props.date % 10 === 1 && props.date !== 11
          ? "st"
          : props.date % 10 === 2 && props.date !== 12
          ? "nd"
          : props.date % 10 === 3 && props.date !== 13
          ? "rd"
          : "th"}
      </Title>
      <Container className={classes.listDayEvents}>
        {props.events.map((event: CalendarEvent, i: number) => {
          return <CalendarListEvent key={i} event={event} />;
        })}
      </Container>
    </Container>
  );
}

function CalendarListView({ ...props }) {
  const { classes } = useStyles();
  const dayjs = useDayjs();
  const currentDate = new Date();
  const currMonth = dayjs(currentDate).format("MMMM");
  const currYear = dayjs(currentDate).format("YYYY");

  const [month, changeMonth] = useState<string>(currMonth);
  const [year, changeYear] = useState<string>(currYear);

  const displayMonth = `${month} 1, ${year}`;
  const displayDate = new Date(displayMonth);

  const filteredEvents = props.events.filter((event: CalendarEvent) => {
    if (event.date.year) {
      return (
        event.date.year === displayDate.getFullYear() &&
        event.date.month === displayDate.getMonth()
      );
    } else {
      return event.date.month === displayDate.getMonth();
    }
  });

  console.log(filteredEvents);
  let calendarDates: number[] = [];
  for (const event of filteredEvents) {
    if (!calendarDates.includes(event.date.date)) {
      calendarDates.push(event.date.date);
    }
  }

  calendarDates.sort((a, b) => a - b);
  console.log(calendarDates);

  return (
    <Container className={classes.listView}>
      <CalendarHeader
        month={month}
        changeMonth={changeMonth}
        changeYear={changeYear}
        year={year}
        lang={props.lang}
      />
      <Container className={classes.listBody}>
        {calendarDates.map((date) => {
          return (
            <CalendarListDay
              key={date}
              date={date}
              events={filteredEvents.filter(
                (event: CalendarEvent) => event.date.date === date
              )}
            />
          );
        })}
      </Container>
    </Container>
  );
}

export default CalendarListView;
