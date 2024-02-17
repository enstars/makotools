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

  const intlFormatter = Intl.NumberFormat(
    locale,
    short
      ? {
          notation: "compact",
          maximumSignificantDigits: 3,
        }
      : undefined
  );

  return intlFormatter.format(number);
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
