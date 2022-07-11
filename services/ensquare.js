/* eslint-disable import/prefer-default-export */

export function getData(data, lang = "ja", source = false) {
  // const databaseURL = ;
  const databaseURL = source
    ? `https://data.ensemble.moe/${lang}/${data}.json`
    : `https://tl.data.ensemble.moe/${lang}/${data}.json`;
  // console.log(databaseURL);
  return fetch(databaseURL)
    .then((response) => response.json())
    .then((responseJson) => {
      return { lang, source, status: "success", data: responseJson };
    })
    .catch((error) => {
      // console.error(error);
      // console.error("error");
      return { lang, source, status: "error", data: null };
    });
}

export function getB2File(path) {
  // return `https://uchuu.ensemble.moe/file/ensemble-square/${path}`;
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
  return {
    main: jaData,
    localized: localized.filter((l) => l.status === "success"),
    localized_full: localized,
  };
}

/*

Lang [Fan]
Lang [Official]
Source [Official] => JP -> CN
English [Fan]

*/
