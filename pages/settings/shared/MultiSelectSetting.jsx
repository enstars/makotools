import { MultiSelect } from "@mantine/core";

import { useFirebaseUser } from "../../../services/firebase/user";

function MultiSelectSetting({ dataKey, data, label, ...props }) {
  const { firebaseUser, setUserDataKey } = useFirebaseUser();

  return (
    <MultiSelect
      value={firebaseUser.firestore?.[dataKey] || null}
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
