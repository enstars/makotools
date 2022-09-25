import { createStyles, Container, Title } from "@mantine/core";

import CalendarListEventCard from "./CalendarListEventCard";

import { CalendarEvent } from "types/makotools";

const useStyles = createStyles((theme, _params, getRef) => ({
  listBody: {
    maxWidth: "100%",
    margin: "auto",
    display: "grid",
    gridTemplateColumns: "auto auto auto",
    gridAutoFlow: "row dense",
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
}));

function CalendarListDay({ ...props }) {
  const { classes } = useStyles();
  return (
    <Container
      className={classes.listDay}
      sx={{ gridRowEnd: `span ${props.events.length}` }}
    >
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
  );
}

export default CalendarListView;
