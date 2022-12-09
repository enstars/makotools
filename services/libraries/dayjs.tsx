import { useRouter } from "next/router";
import { createContext, ReactElement, useContext } from "react";
import dayjs from "dayjs";
import Timezone from "dayjs/plugin/timezone";
import AdvancedFormat from "dayjs/plugin/advancedFormat";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import localeData from "dayjs/plugin/localeData";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isToday from "dayjs/plugin/isToday";
import isBetween from "dayjs/plugin/isBetween";
import utc from "dayjs/plugin/utc";

import "dayjs/locale/en";
import "dayjs/locale/ja";
import "dayjs/locale/zh-cn";
import "dayjs/locale/zh-tw";
import "dayjs/locale/ko";
import "dayjs/locale/id";
import "dayjs/locale/fi";
import "dayjs/locale/vi";
import "dayjs/locale/ru";
import "dayjs/locale/ms";
import "dayjs/locale/es";
import "dayjs/locale/pt";
import "dayjs/locale/pt-br";
import "dayjs/locale/fr";
import "dayjs/locale/de";
import "dayjs/locale/it";
import "dayjs/locale/ar";
import "dayjs/locale/th";

const DayjsContext = createContext({ dayjs });
export const useDayjs = () => useContext(DayjsContext);

function DayjsProvider({ children }: { children: ReactElement }) {
  const { locale } = useRouter();
  dayjs.locale(locale || "en");
  dayjs.extend(Timezone);
  dayjs.extend(AdvancedFormat);
  dayjs.extend(LocalizedFormat);
  dayjs.extend(localeData);
  dayjs.extend(isSameOrBefore);
  dayjs.extend(isSameOrAfter);
  dayjs.extend(isToday);
  dayjs.extend(isBetween);
  dayjs.extend(utc);

  return (
    <DayjsContext.Provider value={{ dayjs }}>{children}</DayjsContext.Provider>
  );
}

export default DayjsProvider;
