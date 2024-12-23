import { MultiSelect, MultiSelectProps } from "@mantine/core";

import { UserData } from "types/makotools";
import useUser from "services/firebase/user";

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
  const { user, userDB, updateUserDB } = useUser();
  const isFirestoreAccessible = user?.id;

  return (
    <MultiSelect
      value={
        (isFirestoreAccessible && (userDB?.[dataKey] as string[])) || undefined
      }
      label={label}
      onChange={(value) => {
        if (userDB) updateUserDB?.mutate({ [dataKey]: value });
      }}
      data={data}
      {...props}
    />
  );
}

export default MultiSelectSetting;
