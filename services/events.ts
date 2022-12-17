/* eslint-disable react-hooks/rules-of-hooks */
import { useDayjs } from "./libraries/dayjs";

import {
  Event,
  BirthdayEvent,
  GameEvent,
  ScoutEvent,
  GameCharacter,
} from "types/game";

function createBirthdayData(characters: GameCharacter[]): BirthdayEvent[] {
  let birthdays = [];
  for (const character of characters) {
    let birthdayEvent: BirthdayEvent = {
      character_id: character.character_id,
      name: `${character.first_name[0]}${
        character.last_name[0] ? " " + character.last_name[0] : ""
      }`,
      start_date: character.birthday,
      end_date: character.birthday,
      type: "birthday",
      banner_id: character.renders?.fs1_5 | 0,
      horoscope: character.horoscope,
    };

    birthdays.push(birthdayEvent);
  }

  return birthdays;
}

function retrieveClosestEvents(
  events: (BirthdayEvent | GameEvent | ScoutEvent)[],
  numOfEvents: number
): (Event | BirthdayEvent | GameEvent | ScoutEvent)[] {
  const { dayjs } = useDayjs();

  let thisYear = new Date().getFullYear();
  const todaysDate: Event = {
    name: "",
    start_date: dayjs.utc().format("YYYY-MM-DDTHH:mm:ss"),
    end_date: dayjs.utc().format("YYYY-MM-DDTHH:mm:ss"),
    type: "other",
  };

  // add proper years to the bdays
  events.forEach((event) => {
    if (new Date(event.start_date).getFullYear() === 2000) {
      let splitDate = event.start_date.split("-");
      let year =
        parseInt(splitDate[1]) <= new Date().getMonth()
          ? new Date().getFullYear() + 1
          : new Date().getFullYear();
      event.start_date = `${year}-${splitDate[1]}-${splitDate[2]} 00:00`;
    }
  });

  let sortedEvents = [...events, todaysDate];

  // sort array by date
  sortedEvents.sort(
    (
      a: BirthdayEvent | GameEvent | ScoutEvent | Event,
      b: BirthdayEvent | GameEvent | ScoutEvent | Event
    ) => {
      return a.start_date < b.start_date
        ? -1
        : a.start_date > b.start_date
        ? 1
        : 0;
    }
  );

  // find today's date in array and retrieve the next amount of dates
  let todayIndex = sortedEvents.indexOf(todaysDate) + 1;

  let newArray: (BirthdayEvent | GameEvent | ScoutEvent | Event)[] = [];

  while (newArray.length < numOfEvents) {
    if (numOfEvents === 1) {
      if ((sortedEvents[todayIndex] as GameEvent).event_id) {
        newArray.push(sortedEvents[todayIndex]);
      }
    } else {
      newArray.push(sortedEvents[todayIndex]);
    }
    if (todayIndex === sortedEvents.length - 1) {
      todayIndex = -1;
    }
    todayIndex++;
  }

  return newArray;
}

function localizeEventTimes(
  events: (BirthdayEvent | GameEvent | ScoutEvent)[]
): (BirthdayEvent | GameEvent | ScoutEvent)[] {
  const { dayjs } = useDayjs();
  // localize the events to user time
  events.forEach((event: BirthdayEvent | GameEvent | ScoutEvent) => {
    if (event.type !== "birthday" && event.type !== "anniversary") {
      // birthday events do not need to be localzied as they are static dates
      event.start_date = dayjs(Date.parse(event.start_date)).format(
        "YYYY-MM-DD HH:MM:ss"
      );
      event.end_date = dayjs(Date.parse(event.end_date)).format(
        "YYYY-MM-DD HH:MM:ss"
      );
    }
  });
  return events;
}

function countdown(dateA: Date, dateB: Date): number {
  const diff = Date.parse(dateA.toString()) - Date.parse(dateB.toString());
  return diff >= 0 ? diff : 0;
}

function toCountdownReadable(amount: number): string {
  const days = Math.floor(amount / 86400000);
  const hours = Math.floor((amount % 86400000) / 3600000);
  const min = Math.floor(((amount % 86400000) % 3600000) / 60000);
  const sec = Math.floor((((amount % 86400000) % 3600000) % 60000) / 1000);
  return `${days > 0 ? `${days}d` : ""} ${hours > 0 ? `${hours}h` : ""} ${
    min > 0 ? `${min}m` : ""
  } ${sec}s`;
}

function isItYippeeTime(dateA: Date, dateB: Date, dayjs: any): boolean {
  let maxDateRange = dayjs(dateB.toString()).add(2000).toDate();
  return dayjs(dateA).isBetween(dayjs(dateB), maxDateRange);
}

export {
  createBirthdayData,
  retrieveClosestEvents,
  localizeEventTimes,
  countdown,
  toCountdownReadable,
  isItYippeeTime,
};
