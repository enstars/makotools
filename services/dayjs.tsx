import { useRouter } from "next/router";
import { createContext, ReactElement, useContext, useEffect } from "react";
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import localeData from "dayjs/plugin/localeData";

import { dayjsLocales } from "./locales";

const DayjsContext = createContext(dayjs);
export const useDayjs = () => useContext(DayjsContext);

function DayjsProvider({ children }: { children: ReactElement }) {
  const router = useRouter();
  const locale = router.locale || "en";
  dayjsLocales.find(({ lang }) => lang === locale)?.import();
  dayjs.locale(locale);
  dayjs.extend(LocalizedFormat);
  dayjs.extend(localeData);

  return (
    <DayjsContext.Provider value={dayjs}>{children}</DayjsContext.Provider>
  );
}

export default DayjsProvider;
