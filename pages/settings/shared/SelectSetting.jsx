import { Group, Select, Text } from "@mantine/core";
import { forwardRef } from "react";

import { useFirebaseUser } from "../../../services/firebase/user";

const SelectItemForwardRef = forwardRef(function SelectItem(
  { label, icon, ...props },
  ref
) {
  return (
    <div ref={ref} {...props}>
      <Group spacing="xs">
        {icon}
        <Text size="sm">{label}</Text>
      </Group>
    </div>
  );
});

function SelectSetting({ dataKey, data, label, ...props }) {
  const { firebaseUser, setUserDataKey } = useFirebaseUser();

  return (
    <Select
      value={firebaseUser.firestore?.[dataKey] || null}
      label={label}
      onChange={(value) => {
        setUserDataKey({ [dataKey]: value });
      }}
      itemComponent={SelectItemForwardRef}
      icon={
        data.filter((r) => r.value === firebaseUser.firestore?.[dataKey])[0]
          ?.icon || null
      }
      data={data}
      {...props}
    />
  );
}

export default SelectSetting;
