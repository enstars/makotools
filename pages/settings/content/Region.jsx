import Flags from "country-flag-icons/react/3x2";

import SelectSetting from "../shared/SelectSetting";

const gameRegions = [
  {
    value: "jp",
    label: "Japan",
    icon: <Flags.JP height={16} style={{ borderRadius: 3 }} />,
  },
  {
    value: "cn",
    label: "Mainland China",
    icon: <Flags.CN height={16} style={{ borderRadius: 3 }} />,
  },
  {
    value: "kr",
    label: "Korea",
    icon: <Flags.KR height={16} style={{ borderRadius: 3 }} />,
  },
  {
    value: "tw",
    label: "Taiwan",
    icon: <Flags.TW height={16} style={{ borderRadius: 3 }} />,
  },
  {
    value: "en",
    label: "Global (English)",
    icon: <Flags.GB height={16} style={{ borderRadius: 3 }} />,
  },
  // { come on baby america
  //   value: "us",
  //   label: "United States",
  //   icon: <Flags.US height={16} style={{ borderRadius: 3 }} />,
  // },
];

function Region() {
  return (
    <SelectSetting
      dataKey="content_region"
      label="Game Region"
      data={gameRegions}
      description="This setting currently does not have an effect on content yet."
    />
  );
}

export default Region;
