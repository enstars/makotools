import { TextInput } from "@mantine/core";
import { useFirebaseUser } from "../../../services/firebase/user";

function Email() {
  const { firebaseUser } = useFirebaseUser();
  return (
    <TextInput label="Email" value={firebaseUser.user.email || " "} readOnly />
  );
}

export default Email;
