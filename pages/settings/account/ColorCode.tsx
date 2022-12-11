import { ColorSwatch, TextInput } from "@mantine/core";

import useUser from "services/firebase/user";

function ColorCode() {
  const user = useUser();
  const cc = user.loggedIn ? "#" + user?.db?.suid : "";
  return (
    <TextInput
      label="Color Code"
      value={cc}
      readOnly
      description={`Your color code is a code unique to you, and cannot be modified or changed.`}
      icon={<ColorSwatch size={16} color={cc} />}
    />
  );
}

export default ColorCode;
