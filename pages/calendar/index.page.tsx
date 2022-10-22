import { useEffect, useState } from "react";
import { Chip, Container, createStyles } from "@mantine/core";

import { getLocalizedDataArray } from "../../services/data";
import PageTitle from "../../components/sections/PageTitle";
import { getLayout } from "../../components/Layout";
import getServerSideUser from "../../services/firebase/getServerSideUser";
import { CalendarEvent, EventType, InGameEvent } from "../../types/makotools";
import { useDayjs } from "../../services/libraries/dayjs";

import CalendarGridView from "./components/CalendarGridView";
import CalendarListView from "./components/CalendarListView";
import CalendarHeader from "./components/CalendarHeader";

/**
 * If the user is viewing from a mobile phone, the default view should be the list view. Otherwise, it should be the traditional calendar.
 */

const useStyles = createStyles((theme, _params, getRef) => ({
  calendar: {
    maxWidth: "100%",

    [`@media (max-width: ${theme.breakpoints.md}px)`]: {
      padding: 0,
    },
  },
}));

function Page({
  events,
  gameEvents,
  lang,
}: {
  events: CalendarEvent[];
  gameEvents: any;
  lang: string;
}) {
  const { classes } = useStyles();
  const { dayjs } = useDayjs();
  const currentDate = new Date();
  const currMonth = dayjs(currentDate).format("MM");
  const currYear = dayjs(currentDate).format("YYYY");

  const [calendarTime, setCalendarTime] = useState<string>(dayjs().format());
  console.log(calendarTime);

  const [view, setView] = useState<string | string[]>("cal");
  const [month, changeMonth] = useState<string>(currMonth);
  const [year, changeYear] = useState<string>(currYear);
  const [showViewOptions, changeShowViewOptions] = useState<boolean>(true);

  const displayMonth = `${month} 1, ${year}`;
  const displayDate = new Date(displayMonth);

  useEffect(() => {
    window.innerWidth < 900 ? setView("list") : setView("cal");
    window.innerWidth < 900
      ? changeShowViewOptions(false)
      : changeShowViewOptions(true);
  }, []);

  return (
    <>
      <PageTitle title="Calendar" />
      {showViewOptions && (
        <Chip.Group value={view} onChange={setView}>
          <Chip value="cal">Calendar view</Chip>
          <Chip value="list">List view</Chip>
        </Chip.Group>
      )}

      <Container className={classes.calendar}>
        <CalendarHeader
          month={month}
          changeMonth={changeMonth}
          changeYear={changeYear}
          year={year}
          lang={lang}
          calendarTime={calendarTime}
          setCalendarTime={setCalendarTime}
        />
        {view === "cal" ? (
          <CalendarGridView events={events} lang={lang} date={displayDate} />
        ) : (
          <CalendarListView events={events} lang={lang} date={displayDate} />
        )}
        {view === "list" && (
          <CalendarHeader
            month={month}
            changeMonth={changeMonth}
            changeYear={changeYear}
            year={year}
            lang={lang}
          />
        )}
      </Container>
    </>
  );
}

export const getServerSideProps = getServerSideUser(async ({ res, locale }) => {
  const characters = await getLocalizedDataArray<GameCharacter>(
    "characters",
    locale,
    "character_id"
  );

  const gameEvents: any = await getLocalizedDataArray<GameEvent>(
    "events",
    locale,
    "event_id"
  );

  const scouts = await getLocalizedDataArray<ScoutEvent>(
    "scouts",
    locale,
    "gacha_id"
  );

  const characterData = characters.data;
  const gameEventData = gameEvents.data;
  const scoutData = scouts.data;

  let events: CalendarEvent[] = [
    {
      id: 100,
      type: "anniversary",
      name: "ENGStars Anniversary",
      date: {
        month: 5,
        date: 16,
      },
      render_id: 2627,
    },
  ];

  if (characterData) {
    for (const character of characterData) {
      let birthDateObj = character.birthday.split("-");
      let birthdayEvent: CalendarEvent = {
        type: "birthday",
        date: {
          month: parseInt(birthDateObj[1]) - 1,
          date: parseInt(birthDateObj[2]),
        },
        id: character.character_id,
        name: `${character.first_name[0]}${
          character.last_name[0] ? " " + character.last_name[0] : ""
        }`,
        render_id: character.renders?.fs1_5 || null,
      };

      events.push(birthdayEvent);
    }
  }

  if (gameEventData) {
    for (const event of gameEventData) {
      let startDateObj = event.start_date[1].split("-");
      let endDateObj = event.end_date[1].split("-");
      let gameEventStart: InGameEvent = {
        type: event.type[1] as EventType,
        status: "start",
        name: event.name[1],
        short_name: event.story_name[1],
        date: {
          month: parseInt(startDateObj[1]) - 1,
          date: parseInt(startDateObj[2]),
          year: parseInt(startDateObj[0]),
        },
        id: event.event_id,
        render_id: event.banner_id[1],
      };

      let gameEventEnd: InGameEvent = {
        type: event.type[1] as EventType,
        status: "end",
        name: event.name[1],
        short_name: event.story_name[1],
        date: {
          month: parseInt(endDateObj[1]) - 1,
          date: parseInt(endDateObj[2]),
          year: parseInt(endDateObj[0]),
        },
        id: event.event_id,
        render_id: event.banner_id[1],
      };

      events.push(gameEventStart);
      events.push(gameEventEnd);
    }
  }

  if (scoutData) {
    for (const scout of scoutData) {
      let startDateObj = scout.start_date[1].split("-");
      let endDateObj = scout.end_date[1].split("-");
      let scoutStart: InGameEvent = {
        type: scout.type[1] as EventType,
        status: "start",
        name:
          scout.type === "feature scout"
            ? scout.name[1].split(" ")[0]
            : scout.name[1],
        date: {
          month: parseInt(startDateObj[1]) - 1,
          date: parseInt(startDateObj[2]),
          year: parseInt(startDateObj[0]),
        },
        id: scout.gacha_id,
        render_id: scout?.five_star?.card_id[1],
      };

      let scoutEnd: InGameEvent = {
        type: scout.type[1] as EventType,
        status: "end",
        name:
          scout.type === "feature scout"
            ? scout.name[1].split(" ")[0]
            : scout.name[1],
        date: {
          month: parseInt(endDateObj[1]) - 1,
          date: parseInt(endDateObj[2]),
          year: parseInt(endDateObj[0]),
        },
        id: scout.gacha_id,
        render_id: scout?.five_star?.card_id[1],
      };

      events.push(scoutStart);
      events.push(scoutEnd);
    }
  }

  return {
    props: {
      events: events,
      gameEvents: gameEventData,
      lang: characters?.lang[0].locale,
    },
  };
});
Page.getLayout = getLayout({ wide: true });
export default Page;
