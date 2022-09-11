import { MultiSelect, MultiSelectProps } from "@mantine/core";

import { useFirebaseUser } from "../../../services/firebase/user";
import { UserData } from "../../../types/makotools";

function MultiSelectSetting({
  label,
  dataKey,
  data,
  ...props
}: Omit<MultiSelectProps, "data"> & {
  label: string;
  dataKey: keyof UserData;
  data: any[];
}) {
  const { firebaseUser, setUserDataKey } = useFirebaseUser();
  const isFirestoreAccessible =
    !firebaseUser.loading && firebaseUser.loggedIn && firebaseUser?.firestore;

  return (
    <MultiSelect
      value={
        (isFirestoreAccessible && firebaseUser.firestore?.[dataKey]) || null
      }
      label={label}
      onChange={(value) => {
        setUserDataKey({ [dataKey]: value });
      }}
      data={data}
      {...props}
    />
  );
}

export default MultiSelectSetting;
