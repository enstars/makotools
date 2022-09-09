import { Locale } from "../types/makotools";

const appLocales: Locale[] = [
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

const DEFAULT_LOCALE: Locale = appLocales[0];

const dayjsLocales = [
  { lang: "en", import: () => import("dayjs/locale/en") },
  { lang: "ja", import: () => import("dayjs/locale/ja") },
  { lang: "zh", import: () => import("dayjs/locale/zh") },
  { lang: "zh-TW", import: () => import("dayjs/locale/zh-tw") },
  { lang: "ko", import: () => import("dayjs/locale/ko") },
  { lang: "id", import: () => import("dayjs/locale/id") },
  { lang: "fil", import: () => import("dayjs/locale/fi") },
  { lang: "vi", import: () => import("dayjs/locale/vi") },
  { lang: "ru", import: () => import("dayjs/locale/ru") },
  { lang: "ms", import: () => import("dayjs/locale/ms") },
  { lang: "es", import: () => import("dayjs/locale/es") },
  { lang: "pt", import: () => import("dayjs/locale/pt") },
  { lang: "pt-BR", import: () => import("dayjs/locale/pt-br") },
  { lang: "fr", import: () => import("dayjs/locale/fr") },
  { lang: "de", import: () => import("dayjs/locale/de") },
  { lang: "it", import: () => import("dayjs/locale/it") },
  { lang: "ar", import: () => import("dayjs/locale/ar") },
  { lang: "th", import: () => import("dayjs/locale/th") },
];

export { appLocales, dayjsLocales, DEFAULT_LOCALE };
