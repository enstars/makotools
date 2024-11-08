import { Checkbox, Group, Input, Select } from "@mantine/core";
import useTranslation from "next-translate/useTranslation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { EditingProfile } from "./customization/EditProfileModal";

import useUser from "services/firebase/user";
import { useDayjs } from "services/libraries/dayjs";

const START_YEAR = 2015;
const START_MONTH = 4;

const thisYear = new Date().getFullYear();
const thisMonth = new Date().getMonth();

function moreThanString(a: string, b: string) {
  return parseInt(a) > parseInt(b);
}

let options = [{ value: "0000-00-00", label: "Unknown" }];
const years = [...Array(thisYear - START_YEAR + 1).keys()]
  .map((v) => v + START_YEAR)
  .map((y) => y.toString());

const allMonths = [...Array(12).keys()]
  .map((v) => v + 1)
  .map((v) => String(v).padStart(2, "0"));
const months: { [year: string]: string[] } = {};

years.forEach((year) => {
  months[year] = [];
  [...Array(12).keys()]
    .map((v) => v + 1)
    .slice(
      year === START_YEAR.toString() ? START_MONTH - 1 : 0,
      year === thisYear.toString() ? thisMonth + 1 : 12
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

function StartPlaying({
  externalSetter,
}: {
  externalSetter: Dispatch<SetStateAction<EditingProfile>>;
}) {
  const { t } = useTranslation("user");
  const { dayjs } = useDayjs();
  const { user, userDB } = useUser();

  const [picked, setPicked] = useState<{
    month: string;
    year: string;
    unknown: boolean;
    loading?: boolean;
  }>({
    month: (thisMonth + 1).toString().padStart(2, "0"),
    year: thisYear.toString().padStart(2, "0"),
    unknown: true,
    loading: true,
  });

  useEffect(() => {
    if (user?.id && userDB) {
      const startPlaying = userDB?.profile__start_playing;
      if (startPlaying && startPlaying !== "0000-00-00") {
        setPicked({
          month: dayjs(startPlaying).format("MM"),
          year: dayjs(startPlaying).format("YYYY"),
          unknown: false,
        });
      } else {
        setPicked({
          month: (thisMonth + 1).toString().padStart(2, "0"),
          year: thisYear.toString().padStart(2, "0"),
          unknown: true,
        });
      }
    }
  }, [user, userDB, dayjs]);

  useEffect(() => {
    const resolvedData = picked.unknown
      ? "0000-00-00"
      : `${picked.year}-${picked.month}-01`;
    if (
      !picked.loading &&
      user?.id &&
      (typeof userDB?.profile__start_playing === "undefined" ||
        userDB?.profile__start_playing !== resolvedData)
    ) {
      externalSetter((s) => ({ ...s, profile__start_playing: resolvedData }));
    }
  }, [picked, user, externalSetter]);

  return (
    <Input.Wrapper label={t("startedPlaying")}>
      <Group>
        <Select
          data={years.map((y) => ({ value: y, label: y }))}
          sx={{ flexGrow: 1, flexBasis: 100 }}
          disabled={picked.unknown}
          placeholder={t("year")}
          searchable
          value={picked.unknown ? null : picked.year}
          onChange={(value) => {
            if (value) {
              setPicked((p) => {
                let currentMonth = p.month;
                const newMonths = months[value];
                if (
                  moreThanString(currentMonth, newMonths[newMonths.length - 1])
                ) {
                  currentMonth = newMonths[newMonths.length - 1];
                } else if (!moreThanString(currentMonth, newMonths[0])) {
                  currentMonth = newMonths[0];
                }
                return {
                  ...p,
                  month: currentMonth,
                  year: value,
                };
              });
            }
          }}
        />
        <Select
          data={
            allMonths.map((m) => ({
              label: dayjs.months()[parseInt(m) - 1],
              value: m,
              disabled: !months?.[picked.year].includes(m),
            })) || []
          }
          sx={{ flexGrow: 1.5, flexBasis: 100 }}
          disabled={picked.unknown}
          placeholder={t("month")}
          searchable
          value={picked.unknown ? null : picked.month}
          onChange={(value) => {
            if (value) {
              setPicked((p) => ({
                ...p,
                month: value,
              }));
            }
          }}
        />

        <Checkbox
          label={t("unknown")}
          checked={picked.unknown}
          onChange={(event) => {
            // DO NOT REMOVE LINE BELOW. THIS IS REQUIRED FOR SOME REASON
            const checked = !!event?.currentTarget?.checked;
            setPicked((p) => ({
              ...p,
              unknown: checked,
            }));
          }}
        />
      </Group>
    </Input.Wrapper>
  );
}

export default StartPlaying;
