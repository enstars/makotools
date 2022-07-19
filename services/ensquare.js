/* eslint-disable import/prefer-default-export */

export function getData(data, lang = "ja", source = false) {
  const databaseURL = source
    ? `https://data.ensemble.moe/${lang}/${data}.json`
    : `https://tl.data.ensemble.moe/${lang}/${data}.json`;
  return fetch(databaseURL)
    .then((response) => response.json())
    .then((responseJson) => {
      return { lang, source, status: "success", data: responseJson };
    })
    .catch((error) => {
      return { lang, source, status: "error", data: null };
    });
}

export function getB2File(path) {
  return `https://assets.ensemble.link/${path}`;
}

export async function getLocalizedData(data, locale = "en") {
  const jaData = await getData(data, "ja", true);
  const enFanData = await getData(data, "en");

  const localized = { mainLang: {}, subLang: {} };
  if (locale === "ja") {
    localized.mainLang = jaData;
    localized.subLang = enFanData;
  } else {
    localized.mainLang = enFanData;
    localized.subLang = jaData;
  }
  return {
    main: jaData,
    localized,
  };
}

/*

Lang [Fan]
Lang [Official]
Source [Official] => JP -> CN
English [Fan]

*/
