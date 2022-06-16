/* eslint-disable import/prefer-default-export */

export function getData(data, lang = "jp") {
  // const databaseURL = `https://data.ensemble.moe/${lang}/${data}.json`;
  const databaseURL = `https://tl.data.ensemble.moe/${lang}/${data}.json`;
  return fetch(databaseURL)
    .then((response) => response.json())
    .then((responseJson) => responseJson)
    .catch((error) => {
      console.error(error);
      return { status: "error" };
    });
}

export function getB2File(path) {
  return `https://uchuu.ensemble.moe/file/ensemble-square/${path}`;
}

export async function getLocalizedData(data, locale = "en") {
  const jaData = await getData(data, "ja");
  const enData = await getData(data, "en");

  if (enData.status === "error") {
    return [
      ["en", jaData],
      ["ja", null],
    ];
  }
  if (locale === "ja") {
    return [
      ["ja", jaData],
      ["en", enData],
    ];
  }
  return [
    ["en", enData],
    ["ja", jaData],
  ];
}

/*

Lang [Fan]
Lang [Official]
Source [Official] => JP -> CN
English [Fan]

*/
