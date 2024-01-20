import { CN, GB, JP, KR, TW } from "country-flag-icons/react/3x2";
import useTranslation from "next-translate/useTranslation";

import SelectSetting from "../shared/SelectSetting";

function Region() {
  const { t } = useTranslation("settings");

  const gameRegions = [
    {
      value: "jp",
      label: t("content.jp"),
      icon: <JP height={16} style={{ borderRadius: 3 }} />,
    },
    {
      value: "cn",
      label: t("content.cn"),
      icon: <CN height={16} style={{ borderRadius: 3 }} />,
    },
    {
      value: "kr",
      label: t("content.kr"),
      icon: <KR height={16} style={{ borderRadius: 3 }} />,
    },
    {
      value: "tw",
      label: t("content.tw"),
      icon: <TW height={16} style={{ borderRadius: 3 }} />,
    },
    {
      value: "en",
      label: t("content.en"),
      icon: <GB height={16} style={{ borderRadius: 3 }} />,
    },
  ];

  return (
    <SelectSetting
      dataKey="setting__game_region"
      label={t("content.regionLabel")}
      data={gameRegions}
      description={t("content.regionDesc")}
      placeholder={t("content.regionPlaceholder")}
    />
  );
}

export default Region;
