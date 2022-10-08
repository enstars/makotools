import { ReactElement } from "react";

import useUser from "../../../services/firebase/user";
import { Locale } from "../../../types/makotools";

import { getNameOrder } from "services/game";

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
