import { useMantineTheme } from "@mantine/core";
import { IconMoonStars, IconSun } from "@tabler/icons-react";
import useTranslation from "next-translate/useTranslation";

import SelectSetting from "../shared/SelectSetting";

function DarkMode() {
  const { t } = useTranslation("settings");
  const { colorScheme, other } = useMantineTheme();
  return (
    <SelectSetting
      dataKey="dark_mode"
      value={colorScheme || "dark"}
      label={t("appearance.mode")}
      onChange={(value) => {
        other.setAppColorScheme(value);
      }}
      data={[
        {
          value: "light",
          label: t("appearance.lightMode"),
          icon: <IconSun size={16} />,
        },
        {
          value: "dark",
          label: t("appearance.darkMode"),
          icon: <IconMoonStars size={16} />,
        },
      ]}
      icon={
        colorScheme === "dark" ? (
          <IconMoonStars size={16} />
        ) : (
          <IconSun size={16} />
        )
      }
    />
  );
}

export default DarkMode;
