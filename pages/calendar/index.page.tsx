import { useEffect, useState } from "react";
import { Chip, Container, createStyles } from "@mantine/core";

import PageTitle from "../../components/sections/PageTitle";
import { getLayout } from "../../components/Layout";
import getServerSideUser from "../../services/firebase/getServerSideUser";
import { useDayjs } from "../../services/libraries/dayjs";

import CalendarGridView from "./components/CalendarGridView";
import CalendarListView from "./components/CalendarListView";
import CalendarHeader from "./components/CalendarHeader";

import { getLocalizedDataArray } from "services/data";
import { retrieveEvents } from "services/events";
import {
  GameCharacter,
  GameEvent,
  ScoutEvent,
  BirthdayEvent,
} from "types/game";

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
  lang,
}: {
  events: (BirthdayEvent | GameEvent | ScoutEvent)[];
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
          calendarTime={calendarTime}
          setCalendarTime={setCalendarTime}
        />
        {view === "cal" ? (
          <CalendarGridView
            events={events}
            lang={lang}
            calendarTime={calendarTime}
          />
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

  const events = retrieveEvents({
    characters: characters.data,
    gameEvents: gameEvents.data,
    scouts: scouts.data,
  });

  return {
    props: {
      events: events,
      lang: characters?.lang[0].locale,
    },
  };
});
Page.getLayout = getLayout({ wide: true });
export default Page;
