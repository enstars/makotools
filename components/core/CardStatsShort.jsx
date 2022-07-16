import { useRouter } from "next/router";

let ReactGlobalize = require("react-globalize");
let Globalize = require("globalize");
let FormatNumber = ReactGlobalize.FormatNumber;

Globalize.load(
  require("cldr-data/supplemental/likelySubtags"),
  require("cldr-data/supplemental/numberingSystems"),
  require("cldr-data/supplemental/plurals"),
  require("cldr-data/supplemental/ordinals")
);

function CardStatsShort({ children }) {
  const { locale } = useRouter();

  Globalize.load(
    require(`cldr-data/main/${locale}/numbers`),
    require(`cldr-data/main/${locale}/units`)
  );

  if (isNaN(children) || children === 0) return "?";

  return (
    <FormatNumber
      locale={locale}
      options={{
        compact: "short",
        minimumSignificantDigits: children.toString().length > 5 ? 3 : 2,
        maximumSignificantDigits: children.toString().length > 5 ? 3 : 2,
      }}
    >
      {children}
    </FormatNumber>
  );
}

export default CardStatsShort;
