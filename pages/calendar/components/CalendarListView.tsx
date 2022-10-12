import { createStyles, Container, Title, Box } from "@mantine/core";

import CalendarListEventCard from "./CalendarListEventCard";

import { CalendarEvent, EventDate } from "types/makotools";

const useStyles = createStyles((theme, _params, getRef) => ({
  listBody: {
    maxWidth: "100%",
    margin: "auto",
  },
  listDay: {
    padding: 0,
    height: "100%",
    width: "55%",
    display: "flex",
    flexFlow: "row wrap",
    alignItems: "flex-start",
    justifyContent: "center",

    [`@media (max-width: ${theme.breakpoints.md}px)`]: {
      marginTop: "5vh",
    },
  },
  listDayTitle: {
    width: "auto",
  },
  listDayEvents: {
    width: "auto",
    padding: 0,
    marginBottom: "10%",
  },
}));

function CalendarListDay({ ...props }) {
  const { classes } = useStyles();
  let today = new Date();
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
      <Title order={2} className={classes.listDayTitle}>
        {props.date.date}
        {props.date.date % 10 === 1 && props.date.date !== 11
          ? "st"
          : props.date.date % 10 === 2 && props.date.date !== 12
          ? "nd"
          : props.date.date % 10 === 3 && props.date.date !== 13
          ? "rd"
          : "th"}
      </Title>
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
    console.log(event);
    const found = calendarDates.some(
      (calDate) => calDate.date === event.date.date
    );
    if (!found) calendarDates.push(event.date);
  }

  calendarDates.sort((a, b) => a.date - b.date);
  console.log(calendarDates);

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
