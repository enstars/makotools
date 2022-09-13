import { ClassNames } from "@emotion/react";
import {
  createStyles,
  Button,
  Container,
  Grid,
  Text,
  Title,
} from "@mantine/core";
import { getMonthDays, getMonthsNames } from "@mantine/dates";
import { MonthNames, weekdays } from "dayjs";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons";
import { useState } from "react";

import { useDayjs } from "../../../services/dayjs";
import { CalendarEvent } from "../../../types/makotools";

import CalendarEventCard from "./CalendarEventCard";

const useStyles = createStyles((theme, _params, getRef) => ({
  calendar: {
    maxWidth: "100%",
    padding: 0,
    marginTop: "3%",
  },
  calendarBody: {
    margin: 0,
    maxWidth: "100%",
  },
  header: {
    maxWidth: "100%",
    flexFlow: "row nowrap",
  },
  calTitle: {
    textAlign: "center",
  },
  nav: {
    display: "inline",
    height: "80px",
  },
  week: {
    width: "100%",
    marginTop: "2vh",
    alignItems: "center",
  },
}));

function CalendarHeader({ ...props }) {
  const { classes } = useStyles();
  const months = getMonthsNames(props.lang, "MMMM");

  let prevMonth =
    months.indexOf(props.month) !== 0
      ? months[months.indexOf(props.month) - 1]
      : months[11];

  let nextMonth =
    months.indexOf(props.month) !== 11
      ? months[months.indexOf(props.month) + 1]
      : months[0];

  let prevYear =
    months.indexOf(props.month) === 0 ? props.year - 1 : props.year;
  let nextYear =
    months.indexOf(props.month) === 11 ? props.year + 1 : props.year;

  return (
    <Grid grow columns={7} className={classes.header}>
      <Grid.Col span={1}>
        <Button
          className={classes.nav}
          leftIcon={<IconArrowLeft size={32} />}
          onClick={(e) => {
            props.changeMonth(prevMonth);
            props.changeYear(prevYear);
          }}
        >
          {prevMonth} {prevYear}
        </Button>
      </Grid.Col>
      <Grid.Col span={5} className={classes.calTitle}>
        <Title order={3}>
          {props.month} {props.year}
        </Title>
      </Grid.Col>
      <Grid.Col span={1}>
        <Button
          className={classes.nav}
          rightIcon={<IconArrowRight size={32} />}
          onClick={(e) => {
            props.changeMonth(nextMonth);
            props.changeYear(nextYear);
          }}
        >
          {nextMonth} {nextYear}
        </Button>
      </Grid.Col>
    </Grid>
  );
}

function CalendarDay({ ...props }): React.ReactElement {
  const { classes } = useStyles();
  return (
    <Grid.Col
      span={1}
      sx={(theme) => ({
        display: "flex",
        flexFlow: "column nowrap",
        textAlign: "left",
        color: props.active
          ? "inherit"
          : theme.colorScheme === "dark"
          ? theme.colors.gray[7]
          : theme.colors.gray[4],
        width: "5vw",
        height: "12vh",
      })}
    >
      <Text>{props.day}</Text>
      {props.active &&
        props.events.map((event: CalendarEvent, i: number) => (
          <CalendarEventCard key={i} event={event} />
        ))}
    </Grid.Col>
  );
}

function CalendarWeek({ ...props }) {
  const dayjs = useDayjs();
  const { classes } = useStyles();
  return (
    <Grid columns={7} className={classes.week}>
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
