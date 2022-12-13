import { useRouter } from "next/router";
import { ReactElement } from "react";

import { Locale } from "types/makotools";

import { DEFAULT_LOCALE } from "services/makotools/locales";

function getLocalizedNumber(
  number: any,
  locale: Locale | string = DEFAULT_LOCALE,
  short = false
) {
  if (typeof number !== "number") {
    return number;
  }
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
}

function CardStatsNumber({
  children,
  short = false,
}: {
  children: ReactElement | number | string;
  short?: boolean;
}) {
  const { locale }: { locale?: string } = useRouter();

  if (typeof children !== "number") return <>{children}</>;

  return <>{getLocalizedNumber(children, locale as Locale, short)}</>;
}

export default CardStatsNumber;

export { getLocalizedNumber };
