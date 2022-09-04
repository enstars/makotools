import { useRouter } from "next/router";

import { useFirebaseUser } from "../../../services/firebase/user";

// https://en.wikipedia.org/wiki/Personal_name#Eastern_name_order
const lastFirstLocales = ["ja", "zh", "zh-TW", "ko"];

function getNameOrder({ first_name, last_name }, setting, locale) {
  const firstName = first_name || "";
  const lastName = last_name || "";
  let name = `${firstName} ${lastName}`.trim();

  if (lastFirstLocales.includes(locale)) name = `${lastName}${firstName}`;

  if (setting === "lastfirst") name = `${lastName} ${firstName}`.trim();

  return name;
}

function NameOrder({
  first_name,
  last_name,
}: {
  first_name: string;
  last_name: string;
}) {
  const { locale } = useRouter();
  const { firebaseUser } = useFirebaseUser();

  const nameOrderSetting = firebaseUser.firestore?.name_order || "firstlast";
  const name = getNameOrder(
    { first_name, last_name },
    nameOrderSetting,
    locale
  );
  return <>{name}</>;
}

export default NameOrder;
export { getNameOrder };
