import { GameRegion } from "types/game";
import { Lang, Locale } from "types/makotools";

function getTitleHierarchy(
  strings: string[],
  langData: Lang[],
  locale: Locale,
  gameRegion: GameRegion
): [string[], Lang[]] {
  const mainTitleLanguage = locale;
  const subtitleLanguage = gameRegion;

  const existingStrings = strings.filter(Boolean);
  const existingLangData = langData.filter((l, i) => strings[i]);

  const mainTitleLang = existingLangData.find(
    (lang) => lang.locale === mainTitleLanguage
  );
  const subtitleLang = existingLangData.find(
    (lang) => lang.locale === subtitleLanguage
  );

  const mainTitleIndex = existingLangData.findIndex(
    (lang) => lang.locale === mainTitleLanguage
  );
  const subtitleIndex = existingLangData.findIndex(
    (lang) => lang.locale === subtitleLanguage
  );
  // combine both into one array, skipping empty values
  // keep this line compact
  const title = [
    existingStrings[mainTitleIndex],
    existingStrings[subtitleIndex],
  ].filter(Boolean) as string[];
  const lang = [mainTitleLang, subtitleLang].filter(Boolean) as Lang[];

  // add in the titles and langs not already included
  for (let i = 0; i < strings.length; i++) {
    if (i !== mainTitleIndex && i !== subtitleIndex && strings[i]) {
      title.push(strings[i]);
      lang.push(langData[i]);
    }
  }

  return [title, lang];
}

export { getTitleHierarchy };
