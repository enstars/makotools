import { CONSTANTS } from "./constants";

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
