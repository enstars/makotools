import React, { Dispatch, SetStateAction } from "react";
import useTranslation from "next-translate/useTranslation";

import TextSetting from "./TextSetting";

function Pronouns({
  externalSetter,
  profileState,
}: {
  externalSetter: Dispatch<SetStateAction<any>>;
  profileState: any;
}) {
  const { t } = useTranslation("user");
  return (
    <TextSetting
      label={t("pronounsLabel")}
      dataKey="profile__pronouns"
      placeholder={t("basicProfilePlaceholder")}
      charLimit={30}
      externalSetter={externalSetter}
      profileState={profileState}
      sx={{ "&&": { flexGrow: 1 } }}
    />
  );
}

export default Pronouns;
