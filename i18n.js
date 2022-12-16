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
      const res = await fetch(\`https://tl.stars.ensemble.moe/\${lang?.replace("-","_")}/\${ns}.json\`);
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
    "en", //     English
    "ja", //     Japanese
    "zh-CN", //  Chinese (China)
    "zh-TW", //  Chinese (Taiwan)
    "ko", //     Korean
    "id", //     Indonesian
    "th", //     Thai
    "fil", //    Filipino
    "ms", //     Malay
    "vi", //     Vietnamese
    "pt-BR", //  Portuguese (Brazil)
    "es", //     Spanish
    "ru", //     Russian
    "fr", //     French
    "de", //     German
    "it", //     Italian
    "pl", //     Polish
    "pt", //     Portuguese
  ],
  defaultLocale: "en",
  pages: {
    "*": ["common"],
    "/": ["home"],
    // "/about": ["about"],
  },
};
