import { useState } from "react";
import { Chip, Container, createStyles, Text } from "@mantine/core";

import { getData, getLocalizedDataArray } from "../../services/ensquare";
import PageTitle from "../../components/sections/PageTitle";
import { getLayout } from "../../components/Layout";
import getServerSideUser from "../../services/firebase/getServerSideUser";
import { getB2File } from "../../services/ensquare";
import { twoStarIDs } from "../../data/characterIDtoCardID";
import { BirthdayEvent, CalendarEvent } from "../../types/makotools";
import { useDayjs } from "../../services/dayjs";

import Calendar from "./components/Calendar";
import CalendarListView from "./components/CalendarListView";

/**
 * If the user is viewing from a mobile phone, the default view should be the list view. Otherwise, it should be the traditional calendar.
 */

function Page({
  events,
  gameEvents,
  lang,
}: {
  events: CalendarEvent[];
  gameEvents: any;
  lang: string;
}) {
  const [view, setView] = useState("cal");
  console.log(gameEvents);
  return (
    <>
      <PageTitle title="Calendar" />
      <Chip.Group value={view} onChange={setView}>
        <Chip value="cal">Calendar view</Chip>
        <Chip value="list">List view</Chip>
      </Chip.Group>
      {view === "cal" ? (
        <Calendar events={events} lang={lang} />
      ) : (
        <CalendarListView events={events} lang={lang} />
      )}
    </>
  );
}

export const getServerSideProps = getServerSideUser(async ({ res, locale }) => {
  const characters = await getLocalizedDataArray<GameCharacter>(
    "characters",
    locale,
    "character_id"
  );

  const gameEvents = await getLocalizedDataArray<GameEvent>(
    "events",
    locale,
    "event_id"
  );

  const characterData = characters?.data;
  const gameEventData = gameEvents.data;

  let events = [];

  for (const character of characterData) {
    let birthDateObj = character.birthday.split("-");
    let birthdayEvent: BirthdayEvent = {
      type: "birthday",
      date: {
        month: parseInt(birthDateObj[1]) - 1,
        date: parseInt(birthDateObj[2]),
      },
      character_id: character.character_id,
      character_name: `${character.first_name[0]}${
        character.last_name[0] ? " " + character.last_name[0] : ""
      }`,
      character_render: character.renders?.fs1_5 || null,
    };

    events.push(birthdayEvent);
  }

  for (const event of gameEventData) {
    let startDateObj = event.start_date[0].split("-");
    let endDateObj = event.end_date[0].split("-");
    let gameEventStart = {
      type: event.type[0],
      status: "start",
      event_name: event.name[0],
      short_name: event.story_name[0],
      date: {
        month: parseInt(startDateObj[1]) - 1,
        date: parseInt(startDateObj[2]),
        year: parseInt(startDateObj[0]),
      },
      event_id: event.event_id,
      five_star_id: event.five_star_id[0],
    };

    let gameEventEnd = {
      type: event.type[0],
      status: "end",
      event_name: event.name[0],
      short_name: event.story_name[0],
      date: {
        month: parseInt(endDateObj[1]) - 1,
        date: parseInt(endDateObj[2]),
        year: parseInt(endDateObj[0]),
      },
      event_id: event.event_id,
      five_star_id: event.five_star_id[0],
    };

    events.push(gameEventStart);
    events.push(gameEventEnd);
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
