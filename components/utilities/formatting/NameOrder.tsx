import { useRouter } from "next/router";
import { ReactElement } from "react";

import { getNameOrder } from "../../../services/ensquare";
import { useUser } from "../../../services/firebase/user";
import { DEFAULT_LOCALE } from "../../../services/locales";
import { Locale } from "../../../types/makotools";

function NameOrder({
  first_name,
  last_name,
  locale,
}: {
  first_name: string[];
  last_name: string[];
  locale: Locale;
}): ReactElement {
  const user = useUser();

  console.log(first_name, last_name);
  const nameOrderSetting =
    (!user.loading && user.loggedIn && user?.db?.setting__name_order) ||
    "firstlast";
  const name = getNameOrder(
    { first_name, last_name },
    nameOrderSetting,
    locale
  );
  return <>{name}</>;
}

export default NameOrder;
export { getNameOrder };
