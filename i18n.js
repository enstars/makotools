module.exports = {
  locales: [
    // Official game languages
    "en", // English
    "ja", // Japanese
    "zh", // Standard Mandarin / Simplified
    "zh-TW", // Taiwanese Mandarin / Traditional
    "ko", // Korean

    //  MakoTools statistics
    "id", // Indonesian
    "pt-BR", // Brazilian Portugese
    "es", // Spanish
    "th", // Thai
    "ru", // Russian
    // "it", // Italian
    // "fil", // Filipino
    // "ms", // Malaysian
    // "vi", // Vietnamese
    // "de", // German
    // "pol", // Polish
    // "fr", // French
    // "pt", // Portugese
  ],
  defaultLocale: "en",
  pages: {
    "*": ["common"],
    "/": ["home"],
    // "/about": ["about"],
  },
  // loadLocaleFrom: async (lang, ns) => {
  //   return import(`./locales/${lang}/${ns}.json`).then((m) => m.default);
  // },
};
