import { useState, useMemo, useEffect } from "react";
import { useFirebaseUser } from "../../services/firebase/user";
import { useDebouncedCallback } from "use-debounce";

import { TextInput, Loader, useMantineTheme } from "@mantine/core";
import { IconCheck } from "@tabler/icons";

function DebouncedUserInput({ label, dataKey, ...props }) {
  const theme = useMantineTheme();
  const { firebaseUser, setUserDataKey } = useFirebaseUser();
  const [inputValue, setInputValue] = useState(
    firebaseUser.firestore?.[dataKey]
  );

  const handleValueChange = useDebouncedCallback((value) => {
    setUserDataKey({ [dataKey]: value });
  }, 1000);

  const memoizedHandleValueChange = useMemo(
    () => handleValueChange,
    [handleValueChange]
  );

  useEffect(() => {
    setInputValue(firebaseUser.firestore?.[dataKey]);
  }, [firebaseUser, dataKey]);

  return (
    <TextInput
      value={inputValue}
      label={label}
      onChange={(e) => {
        setInputValue(e.target.value);
        memoizedHandleValueChange(e.target.value);
      }}
      rightSection={
        inputValue === firebaseUser.firestore?.[dataKey] ? (
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
