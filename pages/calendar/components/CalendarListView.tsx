import {
  createStyles,
  Container,
  Title,
  Card,
  CardSection,
  Image,
  Group,
  Text,
  Badge,
  Grid,
  Button,
} from "@mantine/core";
import { useState } from "react";
import { getMonthDays } from "@mantine/dates";
import { IconCake } from "@tabler/icons";
import Link from "next/link";

import { getB2File } from "../../../services/ensquare";
import { twoStarIDs } from "../../../data/characterIDtoCardID";

import CalendarHeader from "./CalendarHeader";

import { useDayjs } from "services/dayjs";
import { CalendarEvent } from "types/makotools";

const useStyles = createStyles((theme, _params, getRef) => ({
  listView: {
    maxWidth: "100%",
  },
  listBody: {
    maxWidth: "100%",
    margin: "auto",
    display: "grid",
    gridTemplateColumns: "auto auto auto",
    gap: "15px",
    alignContent: "start",

    [`@media (max-width: ${theme.breakpoints.md}px)`]: {
      columnCount: 1,
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
  listEventCard: {
    marginTop: "1vh",
  },
  listEventCardImage: {
    maxHeight: "150px",
  },
  listEventCardText: {
    padding: "1vh 1vw",
  },
  listEventCardButton: {
    margin: "auto",
    marginTop: "1vh",
  },
}));

function CalendarListEvent({ ...props }) {
  const { classes } = useStyles();

  if (props.event.type === "birthday") {
    console.log(props.event.character_render);
    return (
      <Card withBorder className={classes.listEventCard}>
        <Card.Section className={classes.listEventCardImage}>
          <Image
            src={getB2File(
              `assets/card_still_full1_${props.event.character_render}_evolution.webp`
            )}
            alt={props.event.character_name}
            height={150}
            sx={{ marginRight: "100px" }}
          />
        </Card.Section>
        <Card.Section component="a" className={classes.listEventCardText}>
          <Group position="left" spacing="md">
            <Badge color="lime" leftSection={<IconCake size={16} />}>
              Birth
            </Badge>
            <Text size="lg" weight={500}>
              {props.event.character_name}
            </Text>
          </Group>
          <Link href={`/characters/${props.event.character_id}`}>
            <Button
              component="a"
              className={classes.listEventCardButton}
              color="indigo"
              variant="subtle"
              compact
            >
              Visit character page
            </Button>
          </Link>
        </Card.Section>
      </Card>
    );
  }
}

function CalendarListDay({ ...props }) {
  const { classes } = useStyles();
  return (
    <Container className={classes.listDay}>
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
        {props.events.map((event, i) => {
          return <CalendarListEvent key={i} event={event} />;
        })}
      </Container>
    </Container>
  );
}

function CalendarListView({ ...props }) {
  const { classes } = useStyles();
  const dayjs = useDayjs();
  const currentDate = new Date();
  const currMonth = dayjs(currentDate).format("MMMM");
  const currYear = dayjs(currentDate).format("YYYY");

  const [month, changeMonth] = useState<string>(currMonth);
  const [year, changeYear] = useState<string>(currYear);

  const displayMonth = `${month} 1, ${year}`;
  const displayDate = new Date(displayMonth);

  const filteredEvents = props.events.filter((event: CalendarEvent) => {
    if (event.startDate.year) {
      return (
        event.startDate.year === displayDate.getFullYear() &&
        event.startDate.month === displayDate.getMonth()
      );
    } else {
      return event.startDate.month === displayDate.getMonth();
    }
  });

  console.log(filteredEvents);
  let calendarDates: number[] = [];
  for (const event of filteredEvents) {
    if (!calendarDates.includes(event.startDate.date)) {
      calendarDates.push(event.startDate.date);
    }
  }

  calendarDates.sort((a, b) => a - b);
  console.log(calendarDates);

  return (
    <Container className={classes.listView}>
      <CalendarHeader
        month={month}
        changeMonth={changeMonth}
        changeYear={changeYear}
        year={year}
        lang={props.lang}
      />
      <Container className={classes.listBody}>
        {calendarDates.map((date) => {
          return (
            <CalendarListDay
              key={date}
              date={date}
              events={filteredEvents.filter(
                (event) => event.startDate.date === date
              )}
            />
          );
        })}
      </Container>
    </Container>
  );
}

export default CalendarListView;
