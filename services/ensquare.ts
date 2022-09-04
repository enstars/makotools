/* eslint-disable import/prefer-default-export */

import {
  LoadedData,
  LoadedDataRegional,
  LoadedStatus,
  Locale,
} from "../types/makotools";

import { CONSTANTS } from "./constants";

const flatten = require("flat");

export function getData(
  data: string,
  lang: Locale = "ja",
  source: boolean = false,
  fields?: string[]
): Promise<LoadedDataRegional> {
  const databaseURL = source
    ? `${CONSTANTS.EXTERNAL_URLS.DATA}${lang}/${data}.json`
    : `${CONSTANTS.EXTERNAL_URLS.DATA_TL}${lang}/${data}.json`;
  return fetch(databaseURL)
    .then((response) => response.json())
    .then((responseJson) => {
      let responseData = responseJson;
      if (responseData[0]) {
        if (fields) {
          let filteredData: any = [];
          const flattenedDataArray = responseData.map(flatten);

          flattenedDataArray.forEach((originalEntry: any) => {
            let filteredEntry: any = {};
            Object.keys(originalEntry)
              .filter((key) => fields.includes(key))
              .forEach((key) => {
                filteredEntry[key] = originalEntry[key];
              });
            filteredData.push(filteredEntry);
          });

          responseData = filteredData.map(flatten.unflatten);
        }
      }
      return {
        lang,
        source,
        status: "success" as LoadedStatus,
        data: responseData,
      };
    })
    .catch((error) => {
      return {
        lang,
        source,
        status: "error" as LoadedStatus,
        error: error,
      };
    });
}

export function getB2File(path: string) {
  return `${CONSTANTS.EXTERNAL_URLS.ASSETS}${path}`;
  // return `https://assets.ensemble.moe/file/ensemble-square/${path}`;
  // return `https://assets.ensemble.link/${path}`;
}

export async function getLocalizedData(
  data: string,
  locale: Locale = "en",
  fields?: string[]
): Promise<LoadedData<LoadedDataRegional>> {
  const jaData = await getData(data, "ja", true, fields);
  const enFanData = await getData(data, "en", false, fields);
  const enData = await getData(data, "en", true, fields);

  let localized = [enFanData, jaData, enData];
  if (locale === "ja") {
    localized = [jaData, enFanData, enData];
  }
  // localized = localized.filter((l) => l.status === "success");

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
  return `https://preview.ensemble.link/render/${type}.png?${Object.keys(params)
    .map((key) => `${key}=${encodeURIComponent(params[key])}`)
    .join("&")}`;
}
