/* eslint-disable react-hooks/rules-of-hooks */
import { Event, BirthdayEvent, GameEvent, ScoutEvent } from "../types/game";

import { useDayjs } from "./libraries/dayjs";

function retrieveEvents(
  data: any,
  locale: string | undefined
): (BirthdayEvent | GameEvent | ScoutEvent)[] {
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
        horoscope: character.horoscope,
      };

      events.push(birthdayEvent);
    }
  }

  if (data.gameEvents) {
    for (const event of data.gameEvents) {
      let unitId;
      if (event.unit_id === undefined) {
        unitId = null;
      } else if (!isNaN(event.unit_id)) {
        unitId = [event.unit_id];
      } else {
        let arr = event.unit_id.split(",");
        unitId = [];
        for (let i = 0; i < arr.length; i++) {
          unitId.push(parseInt(arr[i]));
        }
      }
      let gameEvent: GameEvent = {
        event_id: event.event_id,
        start_date: event.start_date[locale as string] || event.start_date,
        end_date: event.end_date[locale as string] || event.end_date,
        type: event.type,
        name: event.name[0],
        event_gacha: event.event_gacha,
        event_gacha_id: event.gacha_id,
        banner_id: event.banner_id,
        story_name: event.story_name[1],
        intro_lines: event.intro_lines[1] || null,
        unit_id: unitId,
      };
      events.push(gameEvent);
    }
  }

  if (data.scouts) {
    for (const scout of data.scouts) {
      let scoutEvent: ScoutEvent = {
        gacha_id: scout.gacha_id,
        start_date: scout.start_date[locale as string] || scout.start_date,
        end_date: scout.end_date[locale as string] || scout.end_date,
        type: scout.type,
        name: scout.name[0],
        banner_id: scout.five_star.card_id,
      };
      events.push(scoutEvent);
    }
  }

  return events;
}

function retrieveEvent(event: any, locale: string | undefined): GameEvent {
  let unitId, fiveStars, fourStars, threeStars;
  if (event.unit_id === undefined) {
    unitId = null;
  } else if (!isNaN(event.unit_id)) {
    unitId = [event.unit_id];
  } else {
    let arr = event.unit_id.split(",");
    unitId = [];
    for (let i = 0; i < arr.length; i++) {
      unitId.push(parseInt(arr[i]));
    }
  }
  return {
    event_id: event.event_id,
    name: event.name[0],
    start_date: event.start_date[locale as string] || event.start_date,
    end_date: event.end_date[locale as string] || event.end_date,
    type: event.type,
    story_name: event.story_name[0] || null,
    story_author: event.story_author || null,
    story_season: event.story_season || null,
    banner_id: event.banner_id,
    event_gacha: event.event_gacha || null,
    event_gacha_id: event.event_gacha_id || null,
    intro_lines: event.intro_lines[0] || null,
    unit_id: unitId,
    five_star: {
      chara_id: event.five_star.chara_id || null,
      card_id: event.five_star.card_id || null,
    },
  } as GameEvent;
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
  retrieveEvents,
  retrieveEvent,
  retrieveClosestEvents,
  localizeEventTimes,
  countdown,
  toCountdownReadable,
  isItYippeeTime,
};
