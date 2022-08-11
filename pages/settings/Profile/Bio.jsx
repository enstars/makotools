import React from "react";

import { Textarea } from "@mantine/core";

import TextSetting from "../shared/TextSetting";
import { useFirebaseUser } from "../../../services/firebase/user";

function Name() {
  return (
    <TextSetting
      label="Bio"
      dataKey="profile_bio"
      placeholder="Say something about yourself!"
      charLimit={316}
      Component={Textarea}
      minRows={2}
      maxRows={4}
    />
  );
}

export default Name;
