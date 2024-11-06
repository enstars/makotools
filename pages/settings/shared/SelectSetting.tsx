import { Group, Select, SelectProps, Text } from "@mantine/core";
import { forwardRef, ReactElement } from "react";

import { UserData } from "types/makotools";
import useUser from "services/firebase/user";

const SelectItemForwardRef = forwardRef<HTMLDivElement>(function SelectItem(
  { label, icon, ...props }: { label: string; icon: ReactElement },
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

export { SelectItemForwardRef };

function SelectSetting({
  label,
  dataKey,
  data,
  ...props
}: Omit<SelectProps, "data"> & {
  label: string;
  dataKey: keyof UserData;
  data: any[];
}) {
  const { user, userDB, updateUserDB } = useUser();

  const isFirestoreAccessible = user.loggedIn;
  return (
    <Select
      value={isFirestoreAccessible ? (userDB?.[dataKey] as string) : undefined}
      label={label}
      onChange={(value) => {
        if (user.loggedIn) updateUserDB?.mutate({ [dataKey]: value });
      }}
      itemComponent={SelectItemForwardRef}
      icon={
        (isFirestoreAccessible &&
          data.filter((r) => r.value === userDB?.[dataKey])[0]?.icon) ||
        null
      }
      data={data}
      {...props}
    />
  );
}

export default SelectSetting;
