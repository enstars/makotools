import React from "react";
import TextSetting from "../shared/TextSetting";
import { useFirebaseUser } from "../../../services/firebase/user";
import { Textarea } from "@mantine/core";

function Name() {
  const { firebaseUser } = useFirebaseUser();
  return (
    <TextSetting
      label="Bio"
      dataKey="profile_bio"
      placeholder="Say something about yourself!"
      charLimit={316}
      Component={Textarea}
    />
  );
}

export default Name;
