import { useMantineTheme } from "@mantine/core";
import { IconMoonStars, IconSun } from "@tabler/icons";

import SelectSetting from "../shared/SelectSetting";

function DarkMode() {
  const { colorScheme, other } = useMantineTheme();
  return (
    <SelectSetting
      value={colorScheme || "dark"}
      label={"Mode"}
      onChange={(value) => {
        other.setAppColorScheme(value);
      }}
      data={[
        {
          value: "light",
          label: "Light Mode",
          icon: <IconSun size={16} />,
        },
        {
          value: "dark",
          label: "Dark Mode",
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
