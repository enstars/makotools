import { ReactElement } from "react";

import { Locale, NameOrder, User } from "types/makotools";
import useUser from "services/firebase/user";
import { getNameOrder } from "services/game";

export function getNameOrderSetting(user: User): NameOrder {
  return (
    (!user.loading && user.loggedIn && user?.db?.setting__name_order) ||
    "firstlast"
  );
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
  const user = useUser();

  const nameOrderSetting = getNameOrderSetting(user);
  const name = getNameOrder(
    { first_name, last_name },
    nameOrderSetting,
    locale
  );
  return <>{name}</>;
}

export default NameOrder;
