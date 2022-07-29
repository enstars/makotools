import React from "react";
import TextSetting from "../shared/TextSetting";
import { useFirebaseUser } from "../../../services/firebase/user";

function Name() {
  const { firebaseUser } = useFirebaseUser();
  return (
    <TextSetting
      label="Name"
      dataKey="name"
      placeholder={firebaseUser?.user?.email?.split("@")?.[0] || ""}
      charLimit={50}
    />
  );
}

export default Name;
