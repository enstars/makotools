// https://github.com/aralroca/next-translate/issues/888
const workaround = require("next-translate/lib/cjs/plugin/utils.js");

if (process.env.NODE_ENV === "development") {
  workaround.defaultLoader = `async (lang, ns) => {
    console.log("next-translate (i18n.js): Using local translations");
    return import(\`/locales/\${lang}/\${ns}.json\`).then((m) => m.default);
  }`;
} else {
  workaround.defaultLoader = `async (lang, ns) => {
    try {
      const res = await fetch(\`https://tl.stars.ensemble.moe/\${lang}/\${ns}.json\`);
      if (res.ok) return res.json();
      else throw new Error("no translation");
    }
    catch (e) { 
      return fetch(\`https://tl.stars.ensemble.moe/en/\${ns}.json\`).then((r) =>
        r.json()
      );
    }
  }`;
}

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
