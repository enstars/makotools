import {
  createStyles,
  Container,
  Title,
  Box,
  Text,
  Divider,
} from "@mantine/core";

import CalendarListEventCard from "./CalendarListEventCard";

import { useDayjs } from "services/libraries/dayjs";
import { BirthdayEvent, GameEvent, ScoutEvent } from "types/game";
import { areDatesEqual, areMonthYearEqual } from "services/events";

const useStyles = createStyles((theme, _params, getRef) => ({
  listBody: {
    maxWidth: "100%",
    margin: "auto",

    [`@media (min-width: ${theme.breakpoints.lg}px)`]: {
      marginTop: "3vh",
    },
  },

  listDayDivider: {
    ref: getRef("divider"),
    marginLeft: "1vw",
    transition: "border-left-width 0.5s",

    [`@media (max-width: ${theme.breakpoints.md}px)`]: {
      visibility: "hidden",
    },
  },

  listDay: {
    margin: "auto",
    padding: 0,
    height: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",

    [`@media (max-width: ${theme.breakpoints.md}px)`]: {
      width: "100%",
      flexWrap: "wrap",
      marginTop: "5vh",
    },

    [`@media (min-width: ${theme.breakpoints.lg}px)`]: {
      width: "60%",
      flexWrap: "nowrap",
      marginTop: "2vh",
      marginBottom: "5vh",
    },

    [`&:hover .${getRef("divider")}`]: {
      borderLeftWidth: "24px",
    },
  },
  listDayTitle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",

    [`@media (min-width: ${theme.breakpoints.lg}px)`]: {
      width: "6%",
      flexFlow: "column nowrap",
    },

    [`@media (max-width: ${theme.breakpoints.md}px)`]: {
      width: "33%",
      flexFlow: "row nowrap",
    },
  },
  listDayEvents: {
    padding: 0,

    [`@media (max-width: ${theme.breakpoints.md}px)`]: {
      marginTop: "3vh",
      width: "100%",
    },

    [`@media (min-width: ${theme.breakpoints.lg}px)`]: {
      width: "60%",
    },
  },
  listDayDotw: {
    [`@media (max-width: ${theme.breakpoints.md}px)`]: {
      visibility: "hidden",
    },
  },
}));

interface ListViewObject {
  name: string;
  date: string;
  status?: "start" | "end" | undefined;
  id: number;
}

function CalendarListDay({ ...props }) {
  const { classes } = useStyles();
  const { dayjs } = useDayjs();
  let today = new Date();
  let dayDate =
    props.date.split("-")[0] === "2000"
      ? new Date(`2000-${props.date.split("-")[1]}-${props.date.split("-")[2]}`)
      : new Date(props.date);
  let dotw = dayjs(dayDate).format("ddd");
  let currentDate = props.date.split("-")[2].split(" ")[0];
  return (
    <Container className={classes.listDay}>
      {areDatesEqual(
        props.date,
        `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
      ) && (
        <Box
          sx={(theme) => ({
            width: "10px",
            height: "75px",
            background:
              theme.colorScheme === "dark"
                ? theme.colors.blue[7]
                : theme.colors.blue[4],
            marginRight: "10px",
          })}
        />
      )}
      <Box className={classes.listDayTitle}>
        <Text
          sx={{ textTransform: "uppercase" }}
          size="sm"
          className={classes.listDayDotw}
        >
          {dotw}
        </Text>
        <Title order={2}>
          {currentDate}
          {currentDate % 10 === 1 && currentDate !== 11
            ? "st"
            : currentDate % 10 === 2 && currentDate !== 12
            ? "nd"
            : currentDate % 10 === 3 && currentDate !== 13
            ? "rd"
            : "th"}
        </Title>
      </Box>
      <Divider
        size="lg"
        orientation="vertical"
        className={classes.listDayDivider}
      />
      <Container className={classes.listDayEvents}>
        {props.events.map(
          (event: BirthdayEvent | GameEvent | ScoutEvent, i: number) => {
            return (
              <CalendarListEventCard
                key={i}
                index={i}
                eventsAmt={props.events.length}
                event={event}
                status={
                  event.type === "birthday" || event.type === "anniversary"
                    ? undefined
                    : event.start_date.split(" ")[0] === props.date
                    ? "start"
                    : "end"
                }
              />
            );
          }
        )}
      </Container>
    </Container>
  );
}

function CalendarListView({ ...props }) {
  const { classes } = useStyles();
  const date = `${props.date.getFullYear()}-${
    props.date.getMonth() + 1
  }-${props.date.getDate()} UTC`;
  // get events happening in the active month
  const filteredEvents = props.events.filter(
    (event: BirthdayEvent | GameEvent | ScoutEvent) => {
      if (event.type !== "birthday" && event.type !== "anniversary") {
        return (
          areMonthYearEqual(event.start_date.split(" ")[0], date) ||
          areMonthYearEqual(event.end_date.split(" ")[0], date)
        );
      } else {
        return new Date(event.start_date).getMonth() === props.date.getMonth();
      }
    }
  );

  let allEventDays: string[] = [];

  filteredEvents.forEach((event: BirthdayEvent | GameEvent | ScoutEvent) => {
    // getting all the days in the month that have events
    if (
      !allEventDays.some((day) => day === event.start_date) &&
      parseInt(event.start_date.split("-")[1]) === props.date.getMonth() + 1
    ) {
      allEventDays.push(event.start_date.split(" ")[0]);
    } else if (
      !allEventDays.some((day) => day === event.end_date) &&
      parseInt(event.end_date.split("-")[1]) === props.date.getMonth() + 1 &&
      event.type !== "birthday" &&
      event.type !== "anniversary"
    ) {
      allEventDays.push(event.end_date.split(" ")[0]);
    }
  });

  allEventDays.sort(
    (a: string, b: string) =>
      parseInt(a.split("-")[2]) - parseInt(b.split("-")[2])
  );

  allEventDays = [...new Set(allEventDays)];

  return (
    <Container className={classes.listBody}>
      {allEventDays.map((date, i) => {
        return (
          <CalendarListDay
            key={i}
            date={date.split(" ")[0]}
            events={filteredEvents.filter(
              (event: BirthdayEvent | GameEvent | ScoutEvent) =>
                (parseInt(event.start_date.split("-")[2]) ===
                  parseInt(date.split("-")[2]) &&
                  parseInt(event.start_date.split("-")[1]) ===
                    parseInt(date.split("-")[1])) ||
                (parseInt(event.end_date.split("-")[2]) ===
                  parseInt(date.split("-")[2]) &&
                  parseInt(event.end_date.split("-")[1]) ===
                    parseInt(date.split("-")[1]))
            )}
          />
        );
      })}
    </Container>
  );
}

export default CalendarListView;
