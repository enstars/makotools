import React, { Dispatch, SetStateAction } from "react";

import TextSetting from "./TextSetting";

function Name({
  externalSetter,
  profileState,
}: {
  externalSetter: Dispatch<SetStateAction<any>>;
  profileState: any;
}) {
  return (
    <TextSetting
      label="Name"
      dataKey="name"
      placeholder={"Not set"}
      charLimit={50}
      externalSetter={externalSetter}
      profileState={profileState}
      sx={{ flexGrow: 2 }}
    />
  );
}

export default Name;
