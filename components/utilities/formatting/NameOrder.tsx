import { ReactElement } from "react";

import { Locale, NameOrder, UserData } from "types/makotools";
import useUser from "services/firebase/user";
import { getNameOrder } from "services/game";

export function getNameOrderSetting(
  userDB: UserData | null | undefined
): NameOrder {
  return userDB?.setting__name_order || "firstlast";
}

function NameOrder({
  first_name,
  last_name,
  locale,
}: {
  first_name: string[];
  last_name: string[];
  locale: Locale;
}): ReactElement {
  const { userDB } = useUser();

  const nameOrderSetting = userDB ? getNameOrderSetting(userDB) : "firstlast";
  const name = getNameOrder(
    { first_name, last_name },
    nameOrderSetting,
    locale
  );
  return <>{name}</>;
}

export default NameOrder;
