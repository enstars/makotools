import {
  createStyles,
  Container,
  Grid,
  Text,
  Title,
  Stack,
} from "@mantine/core";
import { getMonthDays, getWeekdaysNames } from "@mantine/dates";

import { CalendarEvent } from "../../../types/makotools";

import CalendarEventCard from "./CalendarEventCard";

import { useDayjs } from "services/libraries/dayjs";

const useStyles = createStyles((theme, _params, getRef) => ({
  calendar: {
    maxWidth: "100%",
    padding: 0,
  },
  calendarBody: {
    margin: "auto",
    maxWidth: "100%",
    padding: "1%",
    marginTop: "1%",
    background:
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.gray[2],
    border: `2px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[9] : theme.colors.gray[4]
    }`,
    borderRadius: theme.radius.md,
  },
  week: {
    maxWidth: "100%",
    margin: "auto",
    marginTop: "1vh",
    marginBottom: "1vh",
    alignItems: "center",
  },
  today: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.blue[7]
        : theme.colors.blue[3],
    borderRadius: `${theme.radius.md}px ${theme.radius.md}px 0px 0px`,
  },
}));

function CalendarDotW({ ...props }) {
  let dotw: String[] = getWeekdaysNames(props.lang);

  return (
    <Grid columns={7} grow sx={{ marginBottom: "2vh", maxWidth: "100%" }}>
      {dotw.map((day, i) => (
        <Grid.Col key={i} span={1} sx={{ textAlign: "center" }}>
          <Title order={5}>{day.substring(0, 1)}</Title>
        </Grid.Col>
      ))}
    </Grid>
  );
}

function CalendarDay({ ...props }): React.ReactElement {
  const { classes } = useStyles();
  let today = new Date();
  return (
    <Grid.Col
      span={1}
      sx={(theme) => ({
        textAlign: "left",
        color: props.active
          ? "inherit"
          : theme.colorScheme === "dark"
          ? theme.colors.dark[3]
          : theme.colors.gray[5],
        width: "5vw",
        height: "15vh",
      })}
    >
      <Stack
        justify={"flex-start"}
        spacing="xs"
        sx={(theme) => ({
          background: !props.active
            ? "inherit"
            : theme.colorScheme === "light"
            ? theme.colors.gray[1]
            : theme.colors.dark[8],
          height: "100%",
          borderRadius: theme.radius.md,
          "&:hover": {
            background: !props.active
              ? "inherit"
              : theme.colorScheme === "light"
              ? theme.colors.gray[0]
              : theme.colors.dark[9],
          },
        })}
        className={props.day}
      >
        <Text
          size="lg"
          sx={{ paddingLeft: "5px", paddingTop: "3px" }}
          className={
            props.day.getDate() === today.getDate() &&
            props.day.getMonth() === today.getMonth() &&
            props.day.getFullYear() === today.getFullYear()
              ? classes.today
              : undefined
          }
        >
          {props.day.getDate()}
        </Text>
        {props.active &&
          props.events.map((event: CalendarEvent, i: number) => (
            <CalendarEventCard key={i} event={event} day={props.day} />
          ))}
      </Stack>
    </Grid.Col>
  );
}

function CalendarWeek({ ...props }) {
  const dayjs = useDayjs();
  const { classes } = useStyles();
  return (
    <Grid columns={7} className={classes.week} gutter="xs">
      {props.week.map((day: Date, i: number) => {
        const filteredEvents = props.events.filter((event: CalendarEvent) => {
          if (event.type !== "birthday" && event.type !== "anniversary") {
            return (
              event.date.year === day.getFullYear() &&
              event.date.month === day.getMonth() &&
              event.date.date === day.getDate()
            );
          } else {
            return (
              event.date.month === day.getMonth() &&
              event.date.date === day.getDate()
            );
          }
        });
        return (
          <CalendarDay
            day={day}
            key={i}
            active={day.getMonth() === props.month}
            events={filteredEvents}
          />
        );
      })}
    </Grid>
  );
}

function CalendarGridView({ ...props }) {
  const { classes } = useStyles();

  return (
    <Container className={classes.calendar}>
      <CalendarDotW lang={props.lang} />
      <Container className={classes.calendarBody}>
        {getMonthDays(props.date).map((week, i) => (
          <CalendarWeek
            month={props.date.getMonth()}
            week={week}
            key={i}
            events={props.events}
          />
        ))}
      </Container>
    </Container>
  );
}

export default CalendarGridView;
