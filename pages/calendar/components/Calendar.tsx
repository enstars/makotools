import { ClassNames } from "@emotion/react";
import {
  createStyles,
  Button,
  Container,
  Grid,
  Text,
  Title,
  Stack,
} from "@mantine/core";
import { getMonthDays, getMonthsNames, getWeekdaysNames } from "@mantine/dates";
import { MonthNames, weekdays } from "dayjs";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons";
import { useState } from "react";

import { CalendarEvent } from "../../../types/makotools";

import CalendarEventCard from "./CalendarEventCard";
import CalendarHeader from "./CalendarHeader";

import { useDayjs } from "services/dayjs";

const useStyles = createStyles((theme, _params, getRef) => ({
  calendar: {
    maxWidth: "100%",
    padding: "5px",
    marginTop: "3%",
    background:
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.gray[2],
    border: `2px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[9] : theme.colors.gray[4]
    }`,
    borderRadius: theme.radius.md,
  },
  calendarBody: {
    margin: "auto",
    padding: 0,
    maxWidth: "100%",
  },
  header: {
    maxWidth: "100%",
    flexFlow: "row nowrap",
    margin: "auto",
    marginBottom: "2vh",
    padding: "2vh 0vw",
  },
  calTitle: {
    textAlign: "center",
  },
  nav: {
    display: "inline",
    height: "40px",
    width: "100%",
    background:
      theme.colorScheme === "dark"
        ? theme.colors.blue[7]
        : theme.colors.blue[4],
  },
  week: {
    maxWidth: "100%",
    margin: "auto",
    marginTop: "2vh",
    alignItems: "center",
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
        overflowY: "scroll",
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
        <Text size="lg" sx={{ paddingLeft: "5px", paddingTop: "3px" }}>
          {props.day}
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
          if (event.startDate.year) {
            return (
              event.startDate.year === day.getFullYear() &&
              event.startDate.month === day.getMonth() &&
              event.startDate.date === day.getDate()
            );
          } else {
            return (
              event.startDate.month === day.getMonth() &&
              event.startDate.date === day.getDate()
            );
          }
        });
        return (
          <CalendarDay
            day={day.getDate()}
            key={i}
            active={day.getMonth() === props.month}
            events={filteredEvents}
          />
        );
      })}
    </Grid>
  );
}

function Calendar({ ...props }) {
  const { classes } = useStyles();
  const dayjs = useDayjs();
  const currentDate = new Date();
  const currMonth = dayjs(currentDate).format("MMMM");
  const currYear = dayjs(currentDate).format("YYYY");

  const [month, changeMonth] = useState<string>(currMonth);
  const [year, changeYear] = useState<string>(currYear);

  const displayMonth = `${month} 1, ${year}`;
  const displayDate = new Date(displayMonth);

  return (
    <Container className={classes.calendar}>
      <CalendarHeader
        month={month}
        changeMonth={changeMonth}
        changeYear={changeYear}
        year={year}
        lang={props.lang}
      />
      <Container className={classes.calendarBody}>
        <CalendarDotW lang={props.lang} />
        {getMonthDays(displayDate).map((week, i) => (
          <CalendarWeek
            month={displayDate.getMonth()}
            week={week}
            key={i}
            events={props.events}
          />
        ))}
      </Container>
    </Container>
  );
}

export default Calendar;
