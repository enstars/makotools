import useTranslation from "next-translate/useTranslation";

import SelectSetting from "../shared/SelectSetting";

function UseWebP() {
  const { t } = useTranslation("settings");
  const webpOptions = [
    {
      value: "use",
      label: t("appearance.use"),
    },
    {
      value: "dont-use",
      label: t("appearance.dontUse"),
    },
  ];

  return (
    <SelectSetting
      dataKey="setting__use_webp"
      label={t("appearance.webPLabel")}
      data={webpOptions}
      description={t("appearance.webPDesc")}
      placeholder={webpOptions[0].label}
    />
  );
}

export default UseWebP;
