import { Dayjs } from "dayjs";

function parseStringify(object: any) {
  try {
    return JSON.parse(JSON.stringify(object));
  } catch (error) {
    return { error };
  }
}

function generateUUID() {
  let dt = new Date().getTime();
  const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
}

function downloadFromURL(url: string) {
  if (document.body) {
    let downloadFrame = document.createElement("iframe");
    downloadFrame.setAttribute("src", url);
    downloadFrame.setAttribute("aria-hidden", "true");
    downloadFrame.setAttribute(
      "style",
      "all: unset; width: 0; height: 0; opacity: 0; position: fixed; pointer-events: none; top: 0; left: 0;"
    );
    document.body.appendChild(downloadFrame);
  }
}

/**
 * Get string for timestamps in DB
 */
function getTimestamp(date: Dayjs) {
  return date.toISOString();
}

export { parseStringify, generateUUID, downloadFromURL, getTimestamp };
