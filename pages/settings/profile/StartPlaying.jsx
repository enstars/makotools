import {
  Box,
  Checkbox,
  Divider,
  Group,
  Input,
  Select,
  Switch,
  Text,
} from "@mantine/core";
import { forwardRef, useState } from "react";
import { useFirebaseUser } from "../../../services/firebase/user";
import SelectSetting from "../shared/SelectSetting";
import { useDayjs } from "../../../services/dayjs";

const START_YEAR = 2015;
const START_MONTH = 4;

const thisYear = new Date().getFullYear();
const thisMonth = new Date().getMonth();

let options = [{ value: "0000-00-00", label: "Unknown" }];
const years = [...Array(thisYear - START_YEAR + 1).keys()].map(
  (v) => v + START_YEAR
);
const months = {};
years.forEach((year) => {
  months[year] = [];
  [...Array(12).keys()]
    .map((v) => v + 1)
    .slice(
      year === START_YEAR ? START_MONTH - 1 : 0,
      year === thisYear ? thisMonth + 1 : 12
    )
    .map((v) => String(v).padStart(2, "0"))
    .forEach((month) => {
      const option = {
        value: `${year}-${month}-01`,
        label: `${month}/${year}`,
      };
      options.push(option);
      months[year].push(month);
    });
});

function StartPlaying() {
  const dayjs = useDayjs();
  const { firebaseUser } = useFirebaseUser();
  const [picked, setPicked] = useState(
    firebaseUser.profile_start_playing
      ? {
          month: dayjs(firebaseUser.profile_start_playing).format("MM"),
          year: dayjs(firebaseUser.profile_start_playing).format("YYYY"),
          unknown: false,
        }
      : { unknown: true }
  );

  console.log(years);

  return (
    // <SelectSetting
    //   dataKey="profile_start_playing"
    //   label="Started Playing"
    //   data={options}
    //   placeholder={options[0].label + " (Default)"}
    //   searchable
    // />
    <Input.Wrapper label="Started Playing">
      <Group>
        <Switch
          label="Unknown"
          value={picked.unknown}
          onChange={(event) => {
            const checked = event?.currentTarget?.checked;
            console.log(checked);
            setPicked((p) => ({
              ...p,
              unknown: checked,
            }));
          }}
        />
        <Text size="sm" weight={500}>
          Year
        </Text>
        <Select
          data={years.map((y) => ({ value: y, label: y.toString() }))}
          sx={{ maxWidth: 150 }}
          disabled={picked.unknown}
        />
      </Group>
    </Input.Wrapper>
  );
}

export default StartPlaying;
