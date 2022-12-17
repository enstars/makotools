import { createStyles, Grid, Text, Stack, Box, Paper } from "@mantine/core";
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
  calendar: {},
  calendarBody: {
    color: "red",
    [`&:hover .${getRef("dayContainer")}`]: {
      opacity: 0.5,
    },
  },
  week: {},
  today: {
    border: `solid 2px ${theme.colors.hokke[5]}`,
    // [`& .${getRef("dateLabel")}`]: {
    //   backgroundColor: theme.colors.hokke[5],
    //   alignSelf: "start",
    //   padding: "2px 3px",
    //   minWidth: 24,
    //   borderRadius: 999,
    //   color: "white",
    //   textAlign: "center",
    // },
  },
  dateLabel: {
    ref: getRef("dateLabel"),
  },
  dayContainer: {
    ref: getRef("dayContainer"),
    textAlign: "left",
    height: "100px",
    background:
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.gray[1],
    transition: theme.other.transition,
    position: "relative",
    zIndex: 1,
    "&&&&&:hover": {
      opacity: 1,
      transform: "scale(1.1)",
      zIndex: 1000,
      background:
        theme.colorScheme === "dark"
          ? theme.colors.dark[5]
          : theme.colors.gray[2],
    },
  },
  inactive: {
    background:
      theme.colorScheme === "dark"
        ? theme.colors.dark[7]
        : theme.colors.gray[0],
    pointerEvents: "none",
  },
}));

function CalendarDotW() {
  const { dayjs } = useDayjs();

  return (
    <>
      {dayjs.weekdaysShort().map((day, i) => (
        <Grid.Col key={i} span={1} mb={4}>
          <Text color="dimmed" weight={700} size="sm" align="center">
            {day}
          </Text>
        </Grid.Col>
      ))}
    </>
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
  const { classes, cx } = useStyles();
  const { dayjs } = useDayjs();
  return (
    <Grid.Col span={1}>
      <Paper
        className={cx(
          classes.dayContainer,
          dayjs(day).isSame(dayjs(), "day") ? classes.today : undefined,
          active ? undefined : classes.inactive
        )}
        p={6}
      >
        <Stack justify={"flex-start"} spacing={4}>
          <Text
            size="sm"
            pl={4}
            pt={4}
            weight={600}
            color={active ? undefined : "dimmed"}
            className={classes.dateLabel}
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
              return (
                <CalendarEventCard key={i} event={event} status={status} />
              );
            })}
        </Stack>
      </Paper>
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
  return (
    <>
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
    </>
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
    <Box className={classes.calendar}>
      <Grid columns={7} gutter={4} mb={8} className={classes.calendarBody}>
        <CalendarDotW />
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
      </Grid>
    </Box>
  );
}

export default CalendarGridView;
