import { GB, JP, CN, KR, TW } from "country-flag-icons/react/3x2";
import useTranslation from "next-translate/useTranslation";

import SelectSetting from "../shared/SelectSetting";

const flagStyle = { borderRadius: 3, boxShadow: "0 0 3px 0 #0002" };
const gameRegions = [
  {
    value: "jp",
    // label: t("content.jp"),
    icon: <JP height={16} style={flagStyle} />,
  },
  {
    value: "cn",
    // label: t("content.cn"),
    icon: <CN height={16} style={flagStyle} />,
  },
  {
    value: "kr",
    // label: t("content.kr"),
    icon: <KR height={16} style={flagStyle} />,
  },
  {
    value: "tw",
    // label: t("content.tw"),
    icon: <TW height={16} style={flagStyle} />,
  },
  {
    value: "en",
    // label: t("content.en"),
    icon: <GB height={16} style={flagStyle} />,
  },
];

export { gameRegions };

function Region() {
  const { t } = useTranslation("settings");

  return (
    <SelectSetting
      dataKey="setting__game_region"
      label={t("content.regionLabel")}
      data={gameRegions.map((r) => {
        return {
          value: r.value,
          label: t(`content.${r.value}`),
          icon: r.icon,
        };
      })}
      description={t("content.regionDescNew")}
      placeholder={t("content.regionPlaceholder")}
    />
  );
}

export default Region;
