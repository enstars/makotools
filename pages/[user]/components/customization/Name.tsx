import React, { Dispatch, SetStateAction } from "react";
import useTranslation from "next-translate/useTranslation";

import TextSetting from "./TextSetting";

function Name({
  externalSetter,
  profileState,
}: {
  externalSetter: Dispatch<SetStateAction<any>>;
  profileState: any;
}) {
  const { t } = useTranslation("user");
  return (
    <TextSetting
      label={t("nameLabel")}
      dataKey="name"
      placeholder={t("basicProfilePlaceholder")}
      charLimit={50}
      externalSetter={externalSetter}
      profileState={profileState}
      sx={{ flexGrow: 2 }}
    />
  );
}

export default Name;
