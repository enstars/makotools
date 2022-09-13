import { useState } from "react";
import { Container, createStyles, Text } from "@mantine/core";

import { getData, getLocalizedData } from "../../services/ensquare";
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
  const characters = await getLocalizedData("characters", locale);
  const characterData = characters?.mainLang.data;

  let events: CalendarEvent[] = [];

  for (const character of characterData) {
    let birthDateObj = new Date(character.birthday);
    let birthdayEvent: BirthdayEvent = {
      type: "birthday",
      startDate: {
        month: birthDateObj.getMonth(),
        date: birthDateObj.getDate(),
      },
      character_id: character.character_id,
      character_name: `${character.first_name} ${character.last_name}`,
    };

    events.push(birthdayEvent);
  }

  return {
    props: {
      events: events,
      lang: characters?.mainLang.lang,
    },
  };
});
Page.getLayout = getLayout({ wide: true });
export default Page;
