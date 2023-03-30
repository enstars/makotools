import { TextInput } from "@mantine/core";
import useTranslation from "next-translate/useTranslation";
import seedrandom from "seedrandom";

import useUser from "services/firebase/user";

function UniqueCode() {
  const { t } = useTranslation("settings");
  const user = useUser();
  const uniqueCodeGen = user.loggedIn && seedrandom(user?.db?.suid);
  const uniqueCode = uniqueCodeGen ? Math.abs(uniqueCodeGen.int32()) : "";

  return (
    <TextInput
      label={t("account.uniqueCodeLabel")}
      value={uniqueCode}
      readOnly
      description={t("account.uniqueCodeDesc")}
    />
  );
}

export default UniqueCode;
