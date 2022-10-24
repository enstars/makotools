import {
  createStyles,
  Container,
  Grid,
  Text,
  Title,
  Stack,
} from "@mantine/core";
import { getMonthDays } from "@mantine/dates";

import CalendarEventCard from "./CalendarEventCard";

import { useDayjs } from "services/libraries/dayjs";
import {
  BirthdayEvent,
  GameEvent,
  GameEventStatus,
  ScoutEvent,
} from "types/game";

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
  dayContainer: {
    textAlign: "left",
    width: "5vw",
    height: "15vh",
  },
}));

function CalendarDotW() {
  const { dayjs } = useDayjs();

  return (
    <Grid columns={7} grow sx={{ marginBottom: "2vh", maxWidth: "100%" }}>
      {dayjs.weekdaysShort().map((day, i) => (
        <Grid.Col key={i} span={1} sx={{ textAlign: "center" }}>
          <Title order={5}>{day}</Title>
        </Grid.Col>
      ))}
    </Grid>
  );
}

function CalendarDay({
  day,
  active,
  events,
}: {
  day: Date;
  active: boolean;
  events: (BirthdayEvent | GameEvent | ScoutEvent)[];
}) {
  const { classes } = useStyles();
  const { dayjs } = useDayjs();
  return (
    <Grid.Col
      span={1}
      className={classes.dayContainer}
      sx={(theme) => ({
        color: active
          ? "inherit"
          : theme.colorScheme === "dark"
          ? theme.colors.dark[3]
          : theme.colors.gray[5],
      })}
    >
      <Stack
        justify={"flex-start"}
        spacing="xs"
        sx={(theme) => ({
          background: !active
            ? "inherit"
            : theme.colorScheme === "light"
            ? theme.colors.gray[1]
            : theme.colors.dark[8],
          height: "100%",
          borderRadius: theme.radius.md,
          "&:hover": {
            background: !active
              ? "inherit"
              : theme.colorScheme === "light"
              ? theme.colors.gray[0]
              : theme.colors.dark[9],
          },
        })}
      >
        <Text
          size="lg"
          sx={{ paddingLeft: "5px", paddingTop: "3px" }}
          className={dayjs(day).isToday() ? classes.today : undefined}
        >
          {dayjs(day).date()}
        </Text>
        {active &&
          events.map((event, i) => {
            let status: GameEventStatus;
            if (event.type !== "birthday" && event.type !== "anniversary") {
              status = dayjs(day).isSame(event.start_date, "day")
                ? "start"
                : "end";
            }
            return <CalendarEventCard key={i} event={event} status={status} />;
          })}
      </Stack>
    </Grid.Col>
  );
}

function CalendarWeek({
  calendarTime,
  week,
  events,
}: {
  calendarTime: string;
  week: Date[];
  events: (GameEvent | BirthdayEvent | ScoutEvent)[];
}) {
  const { dayjs } = useDayjs();
  const { classes } = useStyles();
  return (
    <Grid columns={7} className={classes.week} gutter="xs">
      {week.map((day: Date, i: number) => {
        const filteredEvents = events.filter((event) =>
          event.type === "birthday" || event.type === "anniversary"
            ? dayjs(day)
                .year(2000)
                .isSame(dayjs(event.start_date).year(2000), "day")
            : dayjs(day).isSame(event.start_date, "day") ||
              dayjs(day).isSame(event.end_date, "day")
        );
        return (
          <CalendarDay
            day={day}
            key={i}
            active={dayjs(day).isSame(dayjs(calendarTime), "month")}
            events={filteredEvents}
          />
        );
      })}
    </Grid>
  );
}

function CalendarGridView({
  calendarTime,
  events,
}: {
  calendarTime: string;
  events: (BirthdayEvent | GameEvent | ScoutEvent)[];
}) {
  const { classes } = useStyles();
  const { dayjs } = useDayjs();
  return (
    <Container className={classes.calendar}>
      <CalendarDotW />
      <Container className={classes.calendarBody}>
        {getMonthDays(
          dayjs(calendarTime).startOf("M").toDate(),
          dayjs.localeData().firstDayOfWeek() === 0 ? "sunday" : "monday"
        ).map((week: Date[], i) => (
          <CalendarWeek
            calendarTime={calendarTime}
            week={week}
            key={i}
            events={events}
          />
        ))}
      </Container>
    </Container>
  );
}

export default CalendarGridView;
