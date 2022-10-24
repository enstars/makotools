/* eslint-disable react-hooks/rules-of-hooks */
import { Event, BirthdayEvent, GameEvent, ScoutEvent } from "../types/game";

import { useDayjs } from "./libraries/dayjs";

function retrieveEvents(data: any): (BirthdayEvent | GameEvent | ScoutEvent)[] {
  let events: (BirthdayEvent | GameEvent | ScoutEvent)[] = [];

  if (data.characters) {
    for (const character of data.characters) {
      let birthdayEvent: BirthdayEvent = {
        character_id: character.character_id,
        name: `${character.first_name[0]}${
          character.last_name[0] ? " " + character.last_name[0] : ""
        }`,
        start_date: character.birthday,
        end_date: character.birthday,
        type: "birthday",
        banner_id: character.renders?.fs1_5 | 0,
      };

      events.push(birthdayEvent);
    }
  }

  if (data.gameEvents) {
    for (const event of data.gameEvents) {
      let gameEvent: GameEvent = {
        event_id: event.event_id,
        start_date: event.start_date[1],
        end_date: event.end_date[1],
        type: event.type[1],
        name: event.name[1],
        event_gacha: event.event_gacha[1],
        event_gacha_id: event.gacha_id[1],
        banner_id: event.banner_id[1],
        story_name: event.story_name[1],
      };
      events.push(gameEvent);
    }
  }

  if (data.scouts) {
    for (const scout of data.scouts) {
      let scoutEvent: ScoutEvent = {
        gacha_id: scout.gacha_id,
        start_date: scout.start_date[1],
        end_date: scout.end_date[1],
        type: scout.type[1],
        name: scout.name[1],
        banner_id: scout.five_star.card_id[1],
      };
      events.push(scoutEvent);
    }
  }

  return events;
}

function retrieveClosestEvents(
  events: (BirthdayEvent | GameEvent | ScoutEvent)[],
  numOfEvents: number,
  dayjs: any
): (Event | BirthdayEvent | GameEvent | ScoutEvent)[] {
  let thisYear = new Date().getFullYear();
  const todaysDate: Event = {
    name: "",
    start_date: dayjs(new Date()).format("YYYY-MM-DD"),
    end_date: dayjs(new Date()).format("YYYY-MM-DD"),
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
      event.start_date = `${year}-${splitDate[1]}-${splitDate[2]}`;
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

  // find today's date in array and retrieve the next 5 dates
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

function areDatesEqual(dateA: string, dateB: string): boolean {
  if (
    dateA.split("-")[0] === dateB.split("-")[0] &&
    dateA.split("-")[1] === dateB.split("-")[1] &&
    dateA.split("-")[2] === dateB.split("-")[2]
  ) {
    return true;
  } else {
    return false;
  }
}

function areMonthYearEqual(dateA: string, dateB: string): boolean {
  if (
    dateA.split("-")[0] === dateB.split("-")[0] &&
    dateA.split("-")[1] === dateB.split("-")[1]
  ) {
    return true;
  } else {
    return false;
  }
}

function dateToString(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
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

function isEventHappeningToday(event: GameEvent | ScoutEvent): boolean {
  let now = new Date();
  return now >= new Date(event.start_date) && now <= new Date(event.end_date);
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

function isItYippeeTime(dateA: Date, dateB: Date): boolean {
  return dateA === dateB;
}

export {
  retrieveEvents,
  retrieveClosestEvents,
  areDatesEqual,
  areMonthYearEqual,
  dateToString,
  localizeEventTimes,
  countdown,
  isEventHappeningToday,
  toCountdownReadable,
  isItYippeeTime,
};
