module.exports = {
  locales: [
    // Game official languages
    "en", // English
    // "ja", // Japanese
    // "zh", // Standard Mandarin / Simplified
    // "zh-TW", // Taiwanese Mandarin / Traditional
    // "ko", // Korean

    // // MakoTools statistics
    // "id", // Indonesian
    // "fil", // Filipino
    // "ms", // Malaysian
    // "pt-BR", // Brazilian Portugese
    "th", // Thai
    // "vi", // Vietnamese

    // Future adoption, hopefully!
    // "es", // Spanish
    // "de", // German
    // "it", // Italian
    // "pol", // Polish
    // "fr", // French
    // "ru", // Russian
    // "pt", // Portugese
    // "ar", // Arabic
  ],
  defaultLocale: "en",
  pages: {
    "*": ["common"],
    "/": ["home"],
    // "/about": ["about"],
  },
  // loadLocaleFrom: (lang, ns) =>
  //   // You can use a dynamic import, fetch, whatever. You should
  //   // return a Promise with the JSON file.
  //   import(`./locales/${lang}/${ns}.json`).then((m) => m.default),
};
