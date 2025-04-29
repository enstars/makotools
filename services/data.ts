import { flatten } from "flat";
import { CONSTANTS } from "./makotools/constants";
import { DEFAULT_LOCALE } from "./makotools/locales";
import { parseStringify } from "./utilities";

import { Lang, Locale, Query, UL } from "types/makotools";
import { Event, ID } from "types/game";

export function getAssetURL(path: string) {
  return `${CONSTANTS.EXTERNAL_URLS.ASSETS}${path}`;
}

export async function getData<T = any>(
  data: string,
  locale: Locale = "ja",
  source: boolean = false,
  fields?: string[]
): Promise<Query<T>> {
  const lang = {
    locale,
    source,
  };
  const databaseURL = source
    ? `${CONSTANTS.EXTERNAL_URLS.DATA}${locale}/${data}.json`
    : `${CONSTANTS.EXTERNAL_URLS.DATA_TL}${locale}/${data}.json`;
  return fetch(databaseURL)
    .then((response) => {
      return response.json();
    })
    .then((responseJson) => {
      let responseData = responseJson;
      if (responseData[0]) {
        responseData = responseData.filter((d: any) => d.compliant === "TRUE");
        let filteredData: any = [];
        const flattenedDataArray = responseData.map(flatten);

        flattenedDataArray.forEach((originalEntry: any) => {
          let filteredEntry: any = {};
          Object.keys(originalEntry)
            .filter(
              (key) =>
                !fields ||
                !!fields.find(
                  (field) => key.includes(field) || field.includes(key)
                )
            )
            .forEach((key) => {
              if (key !== "compliant") filteredEntry[key] = originalEntry[key];
            });
          filteredData.push(filteredEntry);
        });

        responseData = filteredData.map(flatten.unflatten);
      }
      return {
        lang: [lang],
        status: "success" as "success",
        data: responseData,
      };
    })
    .catch((error) => {
      return {
        lang: [lang],
        status: "error",
        error: parseStringify(error),
        data: null,
      };
    });
}

export async function getLocalizedDataArray<
  LocalizedType,
  Type = UL<LocalizedType>
>(
  data: string,
  locale: Locale | string = DEFAULT_LOCALE,
  idField: keyof Type = "id" as keyof Type,
  fields?: string[]
): Promise<Query<LocalizedType[]>> {
  const jaData = await getData<Type[]>(data, "ja", true, fields);
  const enFanData = await getData<Type[]>(data, "en", false, fields);
  const enData = await getData<Type[]>(data, "en", true, fields);

  let localized = [enFanData, enData, jaData];
  if (locale === "ja") {
    localized = [jaData, enFanData, enData];
  }

  // TODO: Always keep the user's main language as the first one, without filtering out;
  //       This way it can be show mainlang is missing and not immediately replaced with sublang
  const filteredLocalized = localized
    .filter((localeData) => localeData.status === "success")
    // .filter((l) => !(l.lang.locale === "ja" && l.lang.source === true))
    .reverse();

  if (jaData.status === "error") {
    return Promise.resolve(jaData);
  }

  const propertiesToLocalize = new Set();
  let mergedLocales: Lang[] = [];
  filteredLocalized.forEach((localeData) => {
    mergedLocales.unshift(localeData.lang[0]);

    if (
      !(
        localeData.lang[0].locale === "ja" && localeData.lang[0].source === true
      ) &&
      localeData.status === "success"
    )
      localeData.data?.forEach((dataPiece) => {
        Object.keys(flatten(dataPiece)).forEach((key) =>
          propertiesToLocalize.add(key)
        );
      });
  });

  propertiesToLocalize.delete(idField);
  const combinedArray: LocalizedType[] = jaData.data.map((jaItem) => {
    let flattenedJaDataObject = flatten(jaItem);
    filteredLocalized.forEach((localeData) => {
      const matchingLocaleData =
        localeData.data?.find(
          (dataPiece: any) => dataPiece[idField] === jaItem[idField]
        ) || {};
      const flattenedLocalizedData = flatten(matchingLocaleData);
      Array.from(propertiesToLocalize).forEach((key: string) => {
        const thisLanguageFieldData =
          flattenedLocalizedData?.[
            key as keyof typeof flattenedLocalizedData
          ] || null;
        if (
          !flattenedJaDataObject?.[key as keyof typeof flattenedJaDataObject] ||
          !Array.isArray(
            flattenedJaDataObject[key as keyof typeof flattenedJaDataObject]
          )
        ) {
          (flattenedJaDataObject as any)[
            key as keyof typeof flattenedJaDataObject
          ] = [thisLanguageFieldData];
        } else {
          (
            flattenedJaDataObject[
              key as keyof typeof flattenedJaDataObject
            ] as any
          ).unshift(thisLanguageFieldData);
        }
      });
    });
    return flatten.unflatten(parseStringify(flattenedJaDataObject));
  });

  return Promise.resolve({
    status: "success",
    lang: mergedLocales,
    data: combinedArray,
  });
}

export function getItemFromLocalizedDataArray<Type>(
  data: Query<Type[]>,
  id: ID,
  idField: string = "id"
): Query<Type> {
  if (data.status === "error") return data;
  const matchId = (o: any) => o[idField] === id;

  const matchedData = data.data?.find(matchId);

  if (typeof matchedData === "undefined") {
    return { ...data, status: "error", error: "Not found", data: null };
  }
  return { ...data, data: matchedData };
}

export function getItemsFromLocalizedDataArray<Type>(
  data: Query<Type[]>,
  idArray: ID[],
  idField: string = "id"
): Array<Query<Type>> {
  return idArray.map((id) => {
    if (data.status === "error") return data;
    const matchId = (o: any) => o[idField] === id;

    const matchedData = data.data?.find(matchId);

    if (typeof matchedData === "undefined") {
      return { ...data, status: "error", error: "Not found", data: null };
    }
    return { ...data, data: matchedData };
  });
}

// export function getRegionalData<T=any>(){

// }
