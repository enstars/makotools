/* eslint-disable import/prefer-default-export */

import { Data, Locale, LocalizedData, NameOrder } from "../types/makotools";

import { CONSTANTS } from "./constants";
import { DEFAULT_LOCALE } from "./locales";
import { parseStringify } from "./utilities";

const flatten = require("flat");

export async function getData<T = any>(
  data: string,
  lang: Locale = "ja",
  source: boolean = false,
  fields?: string[]
): Promise<Data<T>> {
  const databaseURL = source
    ? `${CONSTANTS.EXTERNAL_URLS.DATA}${lang}/${data}.json`
    : `${CONSTANTS.EXTERNAL_URLS.DATA_TL}${lang}/${data}.json`;
  return fetch(databaseURL)
    .then((response) => {
      console.log(response.url, response.status);
      return response.json();
    })
    .then((responseJson) => {
      let responseData = responseJson;
      if (responseData[0]) {
        const dataRegion =
          (source ? "data" : "data-tl") + "/" + lang + "/" + data;
        if (
          dataRegion !== "data/ja/units" &&
          dataRegion !== "data/ja/unit_to_characters" &&
          dataRegion !== "data-tl/en/characters"
        )
          responseData = responseData.filter(
            (d: any) => d.compliant === "TRUE"
          );
        let filteredData: any = [];
        const flattenedDataArray = responseData.map(flatten);

        flattenedDataArray.forEach((originalEntry: any) => {
          let filteredEntry: any = {};
          Object.keys(originalEntry)
            .filter((key) => !fields || fields.includes(key))
            .forEach((key) => {
              if (key !== "compliant") filteredEntry[key] = originalEntry[key];
            });
          filteredData.push(filteredEntry);
        });

        responseData = filteredData.map(flatten.unflatten);
      }
      return {
        lang,
        source,
        status: "success" as "success",
        data: responseData,
      };
    })
    .catch((error) => {
      return {
        lang,
        source,
        status: "error",
        error: parseStringify(error),
      };
    });
}

export function getB2File(path: string) {
  return `${CONSTANTS.EXTERNAL_URLS.ASSETS}${path}`;
}

export async function getLocalizedData<T>(
  data: string,
  locale: Locale | string = DEFAULT_LOCALE,
  fields?: string[]
): Promise<LocalizedData<T> | undefined> {
  const jaData = await getData(data, "ja", true, fields);
  const enFanData = await getData(data, "en", false, fields);
  const enData = await getData(data, "en", true, fields);

  let localized = [enFanData, jaData, enData];
  if (locale === "ja") {
    localized = [jaData, enFanData, enData];
  }

  localized = localized.filter((l) => l.status === "success");

  if (jaData.status === "error" || localized.length === 0)
    return Promise.resolve(undefined);

  let combined = flatten(jaData);
  localized.map(flatten).forEach((l) => {
    Object.keys(l).forEach((k) => {
      if (!combined?.[k]) {
        combined[k] = [l[k]];
      } else if (Array.isArray(combined[k]) || jaData[k] !== l[k]) {
        // jaData;
      }
    });
  });

  return Promise.resolve({
    main: jaData,
    mainLang: localized[0],
    subLang: localized[1] || null,
    // localized,
    // localized_full: localized,
  });
}

/*

Lang [Fan]
Lang [Official]
Source [Official] => JP -> CN
English [Fan]

*/

export function getPreviewImageURL(type: string, params: any) {
  const urlParams = {
    ...params,
    __end: ";",
  };
  return `${CONSTANTS.EXTERNAL_URLS.PREVIEW}render/${type}.png?${Object.keys(
    urlParams
  )
    .map(
      (key) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(urlParams[key])}`
    )
    .join("&")}`;
}

// https://en.wikipedia.org/wiki/Personal_name#Eastern_name_order
const lastFirstLocales = ["ja", "zh", "zh-TW", "ko"];

export function getNameOrder(
  { first_name, last_name }: { first_name: string; last_name: string },
  setting: NameOrder = "firstlast",
  locale: Locale | string = DEFAULT_LOCALE
) {
  const firstName = first_name || "";
  const lastName = last_name || "";

  if (lastFirstLocales.includes(locale)) return `${lastName}${firstName}`;

  if (setting === "lastfirst") return `${lastName} ${firstName}`.trim();

  return `${firstName} ${lastName}`.trim();
}

export function getItemFromLocalized<L>(
  data: LocalizedData<L[]>,
  id: ID,
  field: string = "id"
): LocalizedData<L, L | undefined> | undefined {
  const matchId = (o: any) => o[field] === id;

  const matchedData = {
    main: {
      ...data.main,
      ...(data.main.status === "success"
        ? { data: data.main.data.find(matchId) }
        : { data: undefined }),
    },
    mainLang: {
      ...data.mainLang,
      ...(data.mainLang.status === "success"
        ? { data: data.mainLang.data.find(matchId) }
        : { data: undefined }),
    },
    subLang: {
      ...data.subLang,
      ...(data.subLang.status === "success"
        ? { data: data.subLang.data.find(matchId) }
        : { data: undefined }),
    },
  };

  if (
    typeof matchedData.main.data === "undefined" ||
    typeof matchedData.mainLang.data === "undefined"
  ) {
    return undefined;
  }
  return matchedData as LocalizedData<L, L | undefined>;
}
