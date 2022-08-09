import { useState, useMemo, useEffect } from "react";
import { useFirebaseUser } from "../../../services/firebase/user";
import { useDebouncedCallback } from "use-debounce";

import {
  TextInput,
  Loader,
  useMantineTheme,
  Textarea,
  Box,
  Text,
} from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons";

function TextSetting({
  label,
  dataKey,
  Component = TextInput,
  showCharCount,
  charLimit,
  ...props
}) {
  const theme = useMantineTheme();
  const { firebaseUser, setUserDataKey } = useFirebaseUser();
  const [inputValue, setInputValue] = useState(
    firebaseUser.firestore?.[dataKey]
  );

  const handleValueChange = useDebouncedCallback((value) => {
    if (!firebaseUser?.firestore?.admin?.disabledTextFields)
      setUserDataKey({ [dataKey]: value });
  }, 2000);

  const memoizedHandleValueChange = useMemo(
    () => handleValueChange,
    [handleValueChange]
  );

  useEffect(() => {
    setInputValue(firebaseUser.firestore?.[dataKey]);
  }, [firebaseUser, dataKey]);

  return (
    <Box>
      <Component
        value={inputValue}
        label={label}
        onChange={(e) => {
          console.log(e.target.value);
          setInputValue(e.target.value);
          if (e.target.value.length <= charLimit) {
            memoizedHandleValueChange(e.target.value);
          }
        }}
        rightSection={
          inputValue?.length > charLimit ? (
            <IconX size={18} color={theme.colors.red[5]} />
          ) : inputValue === firebaseUser.firestore?.[dataKey] ? (
            <IconCheck size={18} color={theme.colors.green[5]} />
          ) : (
            <Loader size="xs" />
          )
        }
        autosize
        {...props}
        error={
          inputValue?.length > charLimit
            ? `${label} must be under ${charLimit} characters`
            : null
        }
        disabled={firebaseUser?.firestore?.admin?.disabledTextFields}
      />
      {showCharCount && (
        <Text align="right" color="dimmed" size="xs" mt="xs">
          Characters: {inputValue?.length}/{charLimit}
        </Text>
      )}
    </Box>
  );
}

export default TextSetting;
