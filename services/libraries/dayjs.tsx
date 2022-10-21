import { useRouter } from "next/router";
import { createContext, ReactElement, useContext } from "react";
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import localeData from "dayjs/plugin/localeData";

import "dayjs/locale/en";
import "dayjs/locale/ja";
import "dayjs/locale/zh";
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

const DayjsContext = createContext(dayjs);
export const useDayjs = () => useContext(DayjsContext);

function DayjsProvider({ children }: { children: ReactElement }) {
  const router = useRouter();
  const locale = router.locale || "en";
  console.log("dl", locale);
  dayjs.locale(locale);
  dayjs.extend(LocalizedFormat);
  dayjs.extend(localeData);

  return (
    <DayjsContext.Provider value={{ dayjs }}>{children}</DayjsContext.Provider>
  );
}

export default DayjsProvider;
