import React, { Dispatch, SetStateAction } from "react";

import TextSetting from "./TextSetting";

function Pronouns({
  externalSetter,
  profileState,
}: {
  externalSetter: Dispatch<SetStateAction<any>>;
  profileState: any;
}) {
  return (
    <TextSetting
      label="Pronouns"
      dataKey="profile__pronouns"
      placeholder={"Not set"}
      charLimit={30}
      externalSetter={externalSetter}
      profileState={profileState}
      sx={{ "&&": { flexGrow: 1 } }}
    />
  );
}

export default Pronouns;
