/* eslint-disable import/prefer-default-export */

export function getData(data, lang = "jp") {
    return fetch(`https://data.ensemble.moe/${lang}/${data}.json`)
        .then((response) => response.json())
        .then((responseJson) => responseJson)
        .catch((error) => {
            console.error(error);
        });
}

export function getB2File(path) {
    return `https://uchuu.ensemble.moe/file/ensemble-square/${path}`;
}
