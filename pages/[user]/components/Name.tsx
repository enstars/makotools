import React from "react";

import TextSetting from "../shared/TextSetting";

function Name() {
  return (
    <TextSetting
      label="Name"
      dataKey="name"
      placeholder={"Not set"}
      charLimit={50}
      sx={{ flexGrow: 2 }}
    />
  );
}

export default Name;
