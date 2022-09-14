import { TextInput } from "@mantine/core";

import { useFirebaseUser } from "../../../services/firebase/user";

function Email() {
  const { user } = useFirebaseUser();
  return (
    <TextInput
      label="Email"
      value={(!user.loading && user.loggedIn && user.user.email) || " "}
      readOnly
    />
  );
}

export default Email;
