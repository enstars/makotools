import React from "react";
import TextSetting from "../shared/TextSetting";
import { useFirebaseUser } from "../../../services/firebase/user";

function Name() {
  const { firebaseUser } = useFirebaseUser();
  return (
    <TextSetting
      label="Name"
      dataKey="name"
      placeholder={"Not set"}
      charLimit={50}
    />
  );
}

export default Name;
