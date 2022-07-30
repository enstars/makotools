import { Text } from "@mantine/core";
import { forwardRef } from "react";
import SelectSetting from "../shared/SelectSetting";

const START_YEAR = 2015;
const START_MONTH = 4;

const thisYear = new Date().getFullYear();
const thisMonth = new Date().getMonth();

function StartPlaying() {
  let options = [{ value: "0000-00-00", label: "Unknown" }];
  const years = [...Array(thisYear - START_YEAR + 1).keys()].map(
    (v) => v + START_YEAR
  );

  years.forEach((year) => {
    [...Array(12).keys()]
      .map((v) => v + 1)
      .slice(
        year === START_YEAR ? START_MONTH - 1 : 0,
        year === thisYear ? thisMonth + 1 : 12
      )
      .map((v) => String(v).padStart(2, "0"))
      .forEach((month) => {
        options.push({
          value: `${year}-${month}-01`,
          label: `${month}/${year}`,
        });
      });
  });

  return (
    <SelectSetting
      dataKey="profile_start_playing"
      label="Started Playing"
      data={options}
      //   description="Only applies to names displayed in western languages. East asian languages retain their original name order."
      placeholder={options[0].label + " (Default)"}
      searchable
    />
  );
}

export default StartPlaying;
