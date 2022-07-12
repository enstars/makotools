import { useState, useMemo, useEffect } from "react";
import { useUserData } from "../../services/userData";
import { useDebouncedCallback } from "use-debounce";

import { TextInput, Loader, useMantineTheme } from "@mantine/core";
import { IconCheck } from "@tabler/icons";

function DebouncedUserInput({ label, dataKey, ...props }) {
  const theme = useMantineTheme();
  const { userData, setUserDataKey } = useUserData();
  const [inputValue, setInputValue] = useState(userData?.[dataKey]);

  const handleValueChange = useDebouncedCallback((value) => {
    setUserDataKey({ [dataKey]: value });
  }, 1000);

  const memoizedHandleValueChange = useMemo(
    () => handleValueChange,
    [handleValueChange]
  );

  useEffect(() => {
    setInputValue(userData?.[dataKey]);
  }, [userData, dataKey]);

  return (
    <TextInput
      value={inputValue}
      label={label}
      onChange={(e) => {
        setInputValue(e.target.value);
        memoizedHandleValueChange(e.target.value);
      }}
      // {...(userData.loading && { disabled: true })}
      rightSection={
        inputValue === userData?.[dataKey] ? (
          <IconCheck size={18} color={theme.colors.green[5]} />
        ) : (
          <Loader size="xs" />
        )
      }
      {...props}
    />
  );
}

export default DebouncedUserInput;
