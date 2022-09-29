import { MultiSelect, MultiSelectProps } from "@mantine/core";

import useUser from "../../../services/firebase/user";
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
  const user = useUser();
  const isFirestoreAccessible = user.loggedIn;

  return (
    <MultiSelect
      value={(isFirestoreAccessible && user.db?.[dataKey]) || null}
      label={label}
      onChange={(value) => {
        if (user.loggedIn) user.db.set({ [dataKey]: value });
      }}
      data={data}
      {...props}
    />
  );
}

export default MultiSelectSetting;
