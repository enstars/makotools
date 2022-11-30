const workaround = require("next-translate/lib/cjs/plugin/utils.js");

// https://github.com/aralroca/next-translate/issues/888
workaround.defaultLoader = `async (lang, ns) => {
    if (process.env.NODE_ENV === "development") {
      return import(\`/locales/\${lang}/\${ns}.json\`).then((m) => m.default);
    }
    console.log("AAAAAAAAAAAAAA");
    try {
      return await (
        await fetch(\`https://tl.stars.ensemble.moe/\${lang}/\${ns}.json\`)
      ).json();
    }
    catch (e) { 
      return fetch(\`https://tl.stars.ensemble.moe/en/\${ns}.json\`).then((r) =>
        r.json()
      );
    }
  }`;

module.exports = {
  locales: [
    // Official game languages
    "en", //      English
    "ja", //      Japanese
    "zh", //      Standard Mandarin / Simplified
    "zh-TW", //   Taiwanese Mandarin / Traditional
    "ko", //      Korean

    //  MakoTools statistics
    "id", //      Indonesian
    "pt-BR", //   Brazilian Portugese
    "es", //      Spanish
    "th", //      Thai
    "ru", //      Russian
    // "it",  //  Italian
    // "fil", //  Filipino
    // "ms",  //  Malaysian
    // "vi",  //  Vietnamese
    // "de",  //  German
    // "pol", //  Polish
    // "fr",  //  French
    // "pt",  //  Portugese
  ],
  defaultLocale: "en",
  pages: {
    "*": ["common"],
    "/": ["home"],
    // "/about": ["about"],
  },
};
