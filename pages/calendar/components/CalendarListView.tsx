import {
  createStyles,
  Container,
  Title,
  Box,
  Text,
  Divider,
} from "@mantine/core";

import CalendarListEventCard from "./CalendarListEventCard";

import { CalendarEvent, EventDate } from "types/makotools";
import { useDayjs } from "services/libraries/dayjs";

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
}));

function CalendarListDay({ ...props }) {
  console.log(props.date);
  const { classes } = useStyles();
  const dayjs = useDayjs();
  let today = new Date();
  let dayDate = new Date(
    `${props.date.year | today.getFullYear()}-${props.date.month}-${
      props.date.date
    }`
  );
  let dotw = dayjs(dayDate).format("ddd");
  return (
    <Container className={classes.listDay}>
      {props.date.date === today.getDate() &&
        props.date.month === today.getMonth() &&
        props.date.year === today.getFullYear() && (
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
        <Text sx={{ textTransform: "uppercase" }} size="sm">
          {dotw}
        </Text>
        <Title order={2}>
          {props.date.date}
          {props.date.date % 10 === 1 && props.date.date !== 11
            ? "st"
            : props.date.date % 10 === 2 && props.date.date !== 12
            ? "nd"
            : props.date.date % 10 === 3 && props.date.date !== 13
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
        {props.events.map((event: CalendarEvent, i: number) => {
          return (
            <CalendarListEventCard
              key={i}
              index={i}
              eventsAmt={props.events.length}
              event={event}
            />
          );
        })}
      </Container>
    </Container>
  );
}

function CalendarListView({ ...props }) {
  const { classes } = useStyles();

  const filteredEvents = props.events.filter((event: CalendarEvent) => {
    if (event.type !== "birthday" && event.type !== "anniversary") {
      return (
        event.date.year === props.date.getFullYear() &&
        event.date.month === props.date.getMonth()
      );
    } else {
      return event.date.month === props.date.getMonth();
    }
  });

  let calendarDates: EventDate[] = [];

  for (const event of filteredEvents) {
    const found = calendarDates.some(
      (calDate) => calDate.date === event.date.date
    );
    if (!found) calendarDates.push(event.date);
  }

  calendarDates.sort((a, b) => a.date - b.date);

  return (
    <Container className={classes.listBody}>
      {calendarDates.map((date) => {
        return (
          <CalendarListDay
            key={date.date}
            date={date}
            events={filteredEvents.filter(
              (event: CalendarEvent) => event.date.date === date.date
            )}
          />
        );
      })}
    </Container>
  );
}

export default CalendarListView;
