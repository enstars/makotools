import {
  createStyles,
  Container,
  Grid,
  Text,
  Title,
  Stack,
} from "@mantine/core";
import { getMonthDays, getWeekdaysNames } from "@mantine/dates";

import CalendarEventCard from "./CalendarEventCard";

import { useDayjs } from "services/libraries/dayjs";
import {
  BirthdayEvent,
  GameEvent,
  GameEventStatus,
  ScoutEvent,
} from "types/game";
import { areDatesEqual, dateToString } from "services/events";

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

function CalendarDotW({ ...props }) {
  let dotw: String[] = getWeekdaysNames(props.lang);
  const { dayjs } = useDayjs();

  const days = dayjs.weekdaysShort();

  return (
    <Grid columns={7} grow sx={{ marginBottom: "2vh", maxWidth: "100%" }}>
      {days.map((day, i) => (
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
  day: string;
  active: boolean;
  events: (BirthdayEvent | GameEvent | ScoutEvent)[];
}): React.ReactElement {
  const { classes } = useStyles();
  let today = dateToString(new Date());
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
        className={day}
      >
        <Text
          size="lg"
          sx={{ paddingLeft: "5px", paddingTop: "3px" }}
          className={day === today ? classes.today : undefined}
        >
          {day.split("-")[2]}
        </Text>
        {active &&
          events.map(
            (event: BirthdayEvent | GameEvent | ScoutEvent, i: number) => {
              let status: GameEventStatus;
              if (event.type !== "birthday" && event.type !== "anniversary") {
                status = areDatesEqual(event.start_date.split(" ")[0], day)
                  ? "start"
                  : "end";
              }
              return (
                <CalendarEventCard
                  key={i}
                  event={event}
                  day={day}
                  status={status}
                />
              );
            }
          )}
      </Stack>
    </Grid.Col>
  );
}

function CalendarWeek({
  calendarTime,
  week,
  events,
  ...props
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
        const filteredEvents = events.filter(
          (event: BirthdayEvent | GameEvent | ScoutEvent) => {
            if (event.type !== "birthday" && event.type !== "anniversary") {
              return (
                areDatesEqual(
                  event.start_date.split(" ")[0],
                  dateToString(day)
                ) ||
                areDatesEqual(event.end_date.split(" ")[0], dateToString(day))
              );
            } else {
              return (
                parseInt(event.start_date.split("-")[1]) ===
                  day.getMonth() + 1 &&
                parseInt(event.start_date.split("-")[2]) === day.getDate()
              );
            }
          }
        );
        return (
          <CalendarDay
            day={dateToString(day)}
            key={i}
            active={day.getMonth() === dayjs(calendarTime).month()}
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
  lang,
}: {
  calendarTime: string;
  events: (BirthdayEvent | GameEvent | ScoutEvent)[];
  lang: string;
}) {
  const { classes } = useStyles();
  const { dayjs } = useDayjs();
  console.log(events);
  return (
    <Container className={classes.calendar}>
      <CalendarDotW lang={lang} />
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
