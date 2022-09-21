import { useState } from "react";
import { Container, createStyles, Text } from "@mantine/core";

import { getData, getLocalizedDataArray } from "../../services/ensquare";
import PageTitle from "../../components/sections/PageTitle";
import { getLayout } from "../../components/Layout";
import getServerSideUser from "../../services/firebase/getServerSideUser";
import { getB2File } from "../../services/ensquare";
import { twoStarIDs } from "../../data/characterIDtoCardID";
import { BirthdayEvent, CalendarEvent } from "../../types/makotools";
import { useDayjs } from "../../services/dayjs";

import Calendar from "./components/Calendar";

function Page({ events, lang }: { events: CalendarEvent[]; lang: string }) {
  return (
    <>
      <PageTitle title="Calendar" />
      <Calendar events={events} lang={lang} />
    </>
  );
}

export const getServerSideProps = getServerSideUser(async ({ res, locale }) => {
  const characters = await getLocalizedDataArray<GameCharacter>(
    "characters",
    locale,
    "character_id",
    [
      "character_id",
      "first_name",
      "last_name",
      "birthday",
      "image_color",
      "sort_id",
    ]
  );

  const characterData = characters?.data;

  let events: CalendarEvent[] = [];

  for (const character of characterData) {
    let birthDateObj = character.birthday.split("-");
    let birthdayEvent: BirthdayEvent = {
      type: "birthday",
      startDate: {
        month: parseInt(birthDateObj[1]) - 1,
        date: parseInt(birthDateObj[2]),
      },
      character_id: character.character_id,
      character_name: `${character.first_name[0]} ${character.last_name[0]}`,
    };

    events.push(birthdayEvent);
  }

  return {
    props: {
      events: events,
      characters: characters,
      lang: characters?.lang[0].locale,
    },
  };
});
Page.getLayout = getLayout({ wide: true });
export default Page;
