/* eslint-disable react-hooks/rules-of-hooks */
import { useDayjs } from "./libraries/dayjs";
import { getNameOrder } from "./game";

import { Birthday, GameCharacter, Campaign } from "types/game";
import { Locale, NameOrder } from "types/makotools";

function createBirthdayData(
  characters: GameCharacter[],
  nameOrder: NameOrder,
  locale: Locale
): Birthday[] {
  let birthdays = [];
  if (characters) {
    for (const character of characters) {
      let birthdayEvent: Birthday = {
        character_id: character.character_id,
        name: character.first_name?.map((c, i) =>
          getNameOrder(
            { first_name: c, last_name: character.last_name[i] },
            nameOrder,
            locale
          )
        ),
        start: {
          jp: character.birthday,
          en: character.birthday,
        },
        end: {
          jp: character.birthday,
          en: character.birthday,
        },

        type: "birthday",
        banner_id: character.renders?.fs1_5,
        horoscope: character.horoscope,
        shortCharacterName: character.first_name,
      };

      birthdays.push(birthdayEvent);
    }
  }
  return birthdays;
}

function retrieveNextCampaigns(campaigns: Campaign[], count = -1) {
  const { dayjs } = useDayjs();

  // add proper years to the bdays
  campaigns.forEach((event) => {
    // if the year is 2000, it means the event is a birthday
    if (dayjs(event.start.en).year() === 2000) {
      // if the birthday this year is before today, add a year to it
      let year = dayjs(event.start.en).year(dayjs().year()).isBefore(dayjs())
        ? dayjs().year() + 1
        : dayjs().year();
      event.start.en = dayjs(event.start.en).year(year).format();
    }
  });

  let sortedCampaigns = campaigns
    .filter((e) => dayjs().isBefore(e.start.en))
    .sort((a, b) => dayjs(a.start.en).unix() - dayjs(b.start.en).unix());

  if (count !== -1) {
    sortedCampaigns = sortedCampaigns.slice(0, count);
  }

  return sortedCampaigns;
}

function countdown(dateA: Date, dateB: Date): number {
  const diff = Date.parse(dateA.toString()) - Date.parse(dateB.toString());
  return diff >= 0 ? diff : 0;
}

function toCountdownReadable(amount: number): string {
  const d = Math.floor(amount / 86400000);
  const h = Math.floor((amount % 86400000) / 3600000);
  const m = Math.floor(((amount % 86400000) % 3600000) / 60000);
  const s = Math.floor((((amount % 86400000) % 3600000) % 60000) / 1000);
  return [
    d > 0 ? `${d}d` : "",
    h > 0 ? `${h}h` : "",
    m > 0 ? `${m}m` : "",
    `${s}s`,
  ].join(" ");
}

function isItYippeeTime(dateA: Date, dateB: Date, dayjs: any): boolean {
  let maxDateRange = dayjs(dateB.toString()).add(2000).toDate();
  return dayjs(dateA).isBetween(dayjs(dateB), maxDateRange);
}

export {
  createBirthdayData,
  retrieveNextCampaigns,
  countdown,
  toCountdownReadable,
  isItYippeeTime,
};
