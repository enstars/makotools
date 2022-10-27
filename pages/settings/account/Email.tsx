import { TextInput } from "@mantine/core";

import useUser from "../../../services/firebase/user";

function Email() {
  const user = useUser();
  return (
    <TextInput
      label="Email"
      value={(user.loggedIn && user.user.email) || " "}
      readOnly
    />
  );
}

export default Email;
