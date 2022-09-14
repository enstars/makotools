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
  const { user, setUserDataKey } = useFirebaseUser();
  const isFirestoreAccessible = !user.loading && user.loggedIn && user.db;

  return (
    <MultiSelect
      value={(isFirestoreAccessible && user.db?.[dataKey]) || null}
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
