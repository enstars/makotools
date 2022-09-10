function parseStringify(object: any) {
  try {
    return JSON.parse(JSON.stringify(object));
  } catch (error) {
    return { error };
  }
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

export { parseStringify, downloadFromURL };
