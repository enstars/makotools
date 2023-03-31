import useTranslation from "next-translate/useTranslation";

import SelectSetting from "../shared/SelectSetting";

function ShowTlBadge() {
  const { t } = useTranslation("settings");

  const tlBadgeOptions = [
    {
      value: "none",
      label: t("appearance.none"),
    },
    {
      value: "unofficial",
      label: t("appearance.unofficial"),
    },
    {
      value: "all",
      label: t("appearance.all"),
    },
  ];

  return (
    <SelectSetting
      dataKey="setting__show_tl_badge"
      label={t("appearance.badgeLabel")}
      data={tlBadgeOptions}
      description={t("appearance.badgeDesc")}
      placeholder={t(`appearance.${tlBadgeOptions[0].value}`)}
    />
  );
}

export default ShowTlBadge;
