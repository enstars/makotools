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

function CalendarListDay({
  date,
  events,
}: {
  date: string;
  events: (BirthdayEvent | GameEvent | ScoutEvent)[];
}) {
  const { classes } = useStyles();
  const { dayjs } = useDayjs();

  return (
    <Container className={classes.listDay}>
      <Box className={classes.listDayTitle}>
        <Text
          sx={{ textTransform: "uppercase" }}
          size="sm"
          className={classes.listDayDotw}
        >
          {dayjs(date).format("ddd")}
        </Text>
        <Title order={2}>{dayjs(date).format("Do")}</Title>
      </Box>
      <Divider
        size="lg"
        orientation="vertical"
        className={classes.listDayDivider}
      />
      <Container className={classes.listDayEvents}>
        {events.map((event, i) => {
          return (
            <CalendarListEventCard
              key={event.name}
              index={i}
              eventsAmt={events.length}
              event={event}
              status={
                event.type === "birthday" || event.type === "anniversary"
                  ? undefined
                  : dayjs(date).isSame(event.start_date, "day")
                  ? "start"
                  : "end"
              }
            />
          );
        })}
      </Container>
    </Container>
  );
}

function CalendarListView({
  calendarTime,
  events,
}: {
  calendarTime: string;
  events: (BirthdayEvent | GameEvent | ScoutEvent)[];
}) {
  const { classes } = useStyles();
  const { dayjs } = useDayjs();
  let calendarTimeDate: Date = dayjs(calendarTime).toDate();
  // get events happening in the active month
  const filteredEvents = events.filter(
    (event: BirthdayEvent | GameEvent | ScoutEvent) =>
      event.type === "birthday" || event.type === "anniversary"
        ? dayjs(calendarTime)
            .year(2000)
            .isSame(dayjs(event.start_date).year(2000), "month")
        : dayjs(calendarTime).isSame(event.start_date, "month") ||
          dayjs(calendarTime).isSame(event.end_date, "month")
  );

  let allEventDays: string[] = [];

  filteredEvents.forEach((event) => {
    // getting all the days in the month that have events
    if (
      !allEventDays.some((day) =>
        dayjs(day).isSame(dayjs(event.start_date).startOf("day"))
      ) &&
      dayjs(calendarTime).month() === dayjs(event.start_date).month()
    ) {
      allEventDays.push(
        dayjs(event.start_date).year(dayjs().year()).startOf("day").format()
      );
    }

    if (
      !allEventDays.some((day) =>
        dayjs(calendarTime).isSame(dayjs(event.end_date).startOf("day"))
      ) &&
      dayjs(calendarTime).month() === dayjs(event.end_date).month()
    ) {
      allEventDays.push(
        dayjs(event.end_date).year(dayjs().year()).startOf("day").format()
      );
    }
  });

  allEventDays.sort(
    (a: string, b: string) => dayjs(a).date() - dayjs(b).date()
  );

  allEventDays = [...new Set(allEventDays)];
  return (
    <Container className={classes.listBody}>
      {allEventDays.map((date, i) => {
        return (
          <CalendarListDay
            key={i}
            date={date}
            events={filteredEvents.filter(
              (event: BirthdayEvent | GameEvent | ScoutEvent) =>
                dayjs(date)
                  .year(2000)
                  .isSame(dayjs(event.start_date).year(2000), "day") ||
                dayjs(date)
                  .year(2000)
                  .isSame(dayjs(event.end_date).year(2000), "day")
            )}
          />
        );
      })}
    </Container>
  );
}

export default CalendarListView;
