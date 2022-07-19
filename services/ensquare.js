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
  const enData = await getData(data, "en", true);

  let localized = [enFanData, jaData, enData];
  if (locale === "ja") {
    localized = [jaData, enFanData, enData];
  }
  localized = localized.filter((l) => l.status === "success");

  return {
    main: jaData,
    mainLang: localized[0],
    subLang: localized[1],
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
