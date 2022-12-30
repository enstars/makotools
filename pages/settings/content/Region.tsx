import { CN, GB, JP, KR, TW } from "country-flag-icons/react/3x2";

import SelectSetting from "../shared/SelectSetting";

const gameRegions = [
  {
    value: "jp",
    label: "Japan",
    icon: <JP height={16} style={{ borderRadius: 3 }} />,
  },
  {
    value: "cn",
    label: "Mainland China",
    icon: <CN height={16} style={{ borderRadius: 3 }} />,
  },
  {
    value: "kr",
    label: "Korea",
    icon: <KR height={16} style={{ borderRadius: 3 }} />,
  },
  {
    value: "tw",
    label: "Taiwan",
    icon: <TW height={16} style={{ borderRadius: 3 }} />,
  },
  {
    value: "en",
    label: "Global (English)",
    icon: <GB height={16} style={{ borderRadius: 3 }} />,
  },
];

function Region() {
  return (
    <SelectSetting
      dataKey="setting__game_region"
      label="Game Region"
      data={gameRegions}
      description="This setting currently does not have an effect on content yet."
      placeholder="Japan (Default)"
    />
  );
}

export default Region;
