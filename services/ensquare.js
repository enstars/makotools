/* eslint-disable import/prefer-default-export */

const flatten = require("flat");

export function getData(data, lang = "ja", source = false, fields = null) {
  const databaseURL = source
    ? `https://data.ensemble.moe/${lang}/${data}.json`
    : `https://tl.data.ensemble.moe/${lang}/${data}.json`;
  return fetch(databaseURL)
    .then((response) => response.json())
    .then((responseJson) => {
      let responseData = responseJson;
      if (responseData[0]) {
        if (fields) {
          let filteredData = [];
          const flattenedDataArray = responseData.map(flatten);

          flattenedDataArray.forEach((d) => {
            let originalEntry = d;
            let filteredEntry = {};
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
      return { lang, source, status: "success", data: responseData };
    })
    .catch((error) => {
      return { lang, source, status: "error", data: null, error: error };
    });
}

export function getB2File(path) {
  return `https://f002.backblazeb2.com/file/ensemble-square/${path}`;
  // return `https://assets.ensemble.moe/file/ensemble-square/${path}`;
  // https://f002.backblazeb2.com/file/ensemble-square/assets/card_rectangle4_2001_evolution.png
  // return `https://assets.ensemble.link/${path}`;
}

export async function getLocalizedData(data, locale = "en", fields = null) {
  const jaData = await getData(data, "ja", true, fields);
  const enFanData = await getData(data, "en", false, fields);
  const enData = await getData(data, "en", true, fields);

  let localized = [enFanData, jaData, enData];
  if (locale === "ja") {
    localized = [jaData, enFanData, enData];
  }
  localized = localized.filter((l) => l.status === "success");

  return {
    main: jaData,
    mainLang: localized[0],
    subLang: localized[1] || null,
    localized,
    localized_full: localized,
  };
}

/*

Lang [Fan]
Lang [Official]
Source [Official] => JP -> CN
English [Fan]

*/

export function getPreviewImageURL(type, params) {
  return `https://preview.ensemble.link/render/${type}.png?${Object.keys(params)
    .map((key) => `${key}=${encodeURIComponent(params[key])}`)
    .join("&")}`;
}
