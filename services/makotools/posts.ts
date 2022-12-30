import qs from "qs";
import { StrapiRequestParams, StrapiResponse } from "strapi-sdk-js";

import { CONSTANTS } from "./constants";

export async function fetchOceans<FetchedType = any>(
  path: string,
  urlParamsObject: StrapiRequestParams = {},
  options = {}
) {
  const mergedOptions = {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  };

  const queryString = qs.stringify(urlParamsObject);
  const requestUrl = `${CONSTANTS.EXTERNAL_URLS.BACKEND}${`/api${path}${
    queryString ? `?${queryString}` : ""
  }`}`;

  const response = await fetch(requestUrl, mergedOptions);
  if (!response.ok) {
    console.error(response.statusText);
    throw new Error(`Error occured while fetching from strapi`);
  }
  const data: StrapiResponse<FetchedType> = await response.json();
  return data;
}
