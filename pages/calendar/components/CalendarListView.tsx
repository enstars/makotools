import {
  createStyles,
  Text,
  Divider,
  Stack,
  Group,
  Container,
} from "@mantine/core";

import CalendarListEventCard from "./CalendarListEventCard";

import { useDayjs } from "services/libraries/dayjs";
import { Birthday, Event, Scout } from "types/game";

const useStyles = createStyles((theme, _params, getRef) => ({
  listBody: {
    padding: 0,
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
    // margin: "auto",
    padding: 0,
    height: "100%",
    flexWrap: "nowrap",
  },
  listDayTitle: {
    flex: "0 0 60px",
    maxWidth: 60,
  },
  listDayEvents: {
    padding: 0,
    width: "100%",
  },
}));

function CalendarListDay({
  date,
  events,
}: {
  date: string;
  events: (Birthday | Event | Scout)[];
}) {
  const { classes } = useStyles();
  const { dayjs } = useDayjs();

  return (
    <Group className={classes.listDay} spacing="xs" align="stretch">
      <Stack
        className={classes.listDayTitle}
        spacing={0}
        justify="start"
        align="end"
      >
        <Text
          sx={{ textTransform: "uppercase" }}
          size="sm"
          color="dimmed"
          weight={500}
        >
          {dayjs(date).format("ddd")}
        </Text>
        <Text size="xl" weight={700} inline>
          {dayjs(date).format("Do")}
        </Text>
      </Stack>
      <Divider orientation="vertical" />
      <Stack className={classes.listDayEvents} spacing={0}>
        {events.map((event, i) => {
          return (
            <CalendarListEventCard
              key={event.name[0]}
              index={i}
              eventsAmt={events.length}
              event={event}
              status={
                event.type === "birthday"
                  ? undefined
                  : dayjs(date).isSame(event.start.en, "day")
                  ? "start"
                  : "end"
              }
            />
          );
        })}
      </Stack>
    </Group>
  );
}

function CalendarListView({
  calendarTime,
  events,
}: {
  calendarTime: string;
  events: (Birthday | Event | Scout)[];
}) {
  const { classes } = useStyles();
  const { dayjs } = useDayjs();
  let calendarTimeDate: Date = dayjs(calendarTime).toDate();
  // get events happening in the active month
  const filteredEvents = events.filter((event: Birthday | Event | Scout) =>
    event.type === "birthday"
      ? dayjs(calendarTime)
          .year(2000)
          .isSame(dayjs(event.start.en).year(2000), "month")
      : dayjs(calendarTime).isSame(event.start.en, "month") ||
        dayjs(calendarTime).isSame(event.end.en, "month")
  );

  let allEventDays: string[] = [];

  filteredEvents.forEach((event) => {
    // getting all the days in the month that have events
    if (
      !allEventDays.some((day) =>
        dayjs(day).isSame(dayjs(event.start.en).startOf("day"))
      ) &&
      dayjs(calendarTime).month() === dayjs(event.start.en).month()
    ) {
      allEventDays.push(
        dayjs(event.start.en).year(dayjs().year()).startOf("day").format()
      );
    }

    if (
      !allEventDays.some((day) =>
        dayjs(calendarTime).isSame(dayjs(event.end.en).startOf("day"))
      ) &&
      dayjs(calendarTime).month() === dayjs(event.end.en).month()
    ) {
      allEventDays.push(
        dayjs(event.end.en).year(dayjs().year()).startOf("day").format()
      );
    }
  });

  allEventDays.sort(
    (a: string, b: string) => dayjs(a).date() - dayjs(b).date()
  );

  allEventDays = [...new Set(allEventDays)];
  return (
    <Container size="sm">
      <Stack className={classes.listBody} spacing={0} align="stretch">
        {allEventDays.map((date, i) => {
          return (
            <CalendarListDay
              key={i}
              date={date}
              events={filteredEvents.filter(
                (event: Birthday | Event | Scout) =>
                  dayjs(date)
                    .year(2000)
                    .isSame(dayjs(event.start.en).year(2000), "day") ||
                  dayjs(date)
                    .year(2000)
                    .isSame(dayjs(event.end.en).year(2000), "day")
              )}
            />
          );
        })}
      </Stack>
    </Container>
  );
}

export default CalendarListView;
