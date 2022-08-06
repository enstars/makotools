const appLocales = [
  // game languages
  "en", // English
  "ja", // Japanese
  "zh", // Standard Mandarin / Simplified
  "zh-TW", // Taiwanese Mandarin / Traditional
  "ko", // Korean
  // Oissu Statistics
  "id", // Indonesian
  "fil", // Filipino
  "vi", // Vietnamese
  "ru", // Russian
  "ms", // Malaysian
  "es", // Spanish
  "pt", // Portugese
  "pt-BR", // Brazilian Portugese
  "fr", // French
  "de", // German
  "it", // Italian
  "ar", // Arabic
  "th", // Thai
];

const dayjsLocales = {
  en: () => import("dayjs/locale/en"),
  ja: () => import("dayjs/locale/ja"),
  zh: () => import("dayjs/locale/zh"),
  "zh-TW": () => import("dayjs/locale/zh-TW"),
  ko: () => import("dayjs/locale/ko"),
  id: () => import("dayjs/locale/id"),
  fil: () => import("dayjs/locale/tl-ph"),
  vi: () => import("dayjs/locale/vi"),
  ru: () => import("dayjs/locale/ru"),
  ms: () => import("dayjs/locale/ms"),
  es: () => import("dayjs/locale/es"),
  pt: () => import("dayjs/locale/pt"),
  "pt-BR": () => import("dayjs/locale/pt-BR"),
  fr: () => import("dayjs/locale/fr"),
  de: () => import("dayjs/locale/de"),
  it: () => import("dayjs/locale/it"),
  ar: () => import("dayjs/locale/ar"),
  th: () => import("dayjs/locale/th"),
};

export { appLocales, dayjsLocales };
