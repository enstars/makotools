import { useRouter } from "next/router";
import { ReactElement } from "react";

import { DEFAULT_LOCALE } from "../../../services/locales";
import { Locale } from "../../../types/makotools";

function getLocalizedNumber(
  number: number,
  locale: Locale | string = DEFAULT_LOCALE,
  short = false
) {
  if (!isNaN(number)) {
    let Globalize = require("globalize");

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
  } else {
    return number;
  }
}

function CardStatsNumber({
  children,
  short = false,
}: {
  children: ReactElement | number | string;
  short?: boolean;
}) {
  const { locale }: { locale?: string } = useRouter();

  if (typeof children !== "number" || children === 0) return children;

  return <>{getLocalizedNumber(children, locale as Locale, short)}</>;
}

export default CardStatsNumber;

export { getLocalizedNumber };
