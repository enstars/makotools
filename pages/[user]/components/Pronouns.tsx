import React from "react";

import TextSetting from "../shared/TextSetting";

function Pronouns() {
  return (
    <TextSetting
      label="Pronouns"
      dataKey="profile__pronouns"
      placeholder={"Not set"}
      charLimit={30}
      sx={{ "&&": { flexGrow: 1 } }}
    />
  );
}

export default Pronouns;
