import { ColorSwatch, TextInput } from "@mantine/core";
import useTranslation from "next-translate/useTranslation";

import useUser from "services/firebase/user";

function ColorCode() {
  const { t } = useTranslation("settings");
  const user = useUser();
  const cc = user.loggedIn ? "#" + user?.db?.suid : "";
  return (
    <TextInput
      label={t("account.colorCodeLabel")}
      value={cc}
      readOnly
      description={t("account.colorCodeDesc")}
      icon={<ColorSwatch size={16} color={cc} />}
    />
  );
}

export default ColorCode;
