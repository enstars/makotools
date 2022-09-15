import { useRouter } from "next/router";

import { getNameOrder } from "../../../services/ensquare";
import { useUser } from "../../../services/firebase/user";
import { DEFAULT_LOCALE } from "../../../services/locales";
import { Locale } from "../../../types/makotools";

function NameOrder({
  first_name,
  last_name,
}: {
  first_name: string;
  last_name: string;
}) {
  const { locale } = useRouter();
  const user = useUser();

  const nameOrderSetting =
    (!user.loading && user.loggedIn && user?.db?.setting__name_order) ||
    "firstlast";
  const name = getNameOrder(
    { first_name, last_name },
    nameOrderSetting,
    (locale as Locale) || DEFAULT_LOCALE
  );
  return <>{name}</>;
}

export default NameOrder;
export { getNameOrder };
