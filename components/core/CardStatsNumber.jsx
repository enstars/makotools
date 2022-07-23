import { useRouter } from "next/router";

function getLocalizedNumber(number, locale, short = false) {
  if (!isNaN(number)) {
    let ReactGlobalize = require("react-globalize");
    let Globalize = require("globalize");
    let FormatNumber = ReactGlobalize.FormatNumber;

    Globalize.load(
      require("cldr-data/supplemental/likelySubtags"),
      require("cldr-data/supplemental/numberingSystems"),
      require("cldr-data/supplemental/plurals"),
      require("cldr-data/supplemental/ordinals"),
      require(`cldr-data/main/${locale}/numbers`),
      require(`cldr-data/main/${locale}/units`)
    );

    return Globalize(locale).numberFormatter(
      short
        ? {
            compact: "short",
            minimumSignificantDigits: number > 99999 ? 3 : 2,
            maximumSignificantDigits: number > 99999 ? 3 : 2,
          }
        : {}
    )(number);
  }
}

function CardStatsNumber({ children, short = false }) {
  const { locale } = useRouter();

  if (isNaN(children) || children === 0) return children;

  return <>{getLocalizedNumber(children, locale, short)}</>;
}

export default CardStatsNumber;

export { getLocalizedNumber };
