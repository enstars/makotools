import { useState, useMemo, useEffect, ChangeEvent } from "react";
import { useDebouncedCallback } from "use-debounce";
import {
  TextInput,
  Loader,
  useMantineTheme,
  Text,
  TextInputProps,
} from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons";

import useUser from "../../../services/firebase/user";
import { UserData } from "../../../types/makotools";

function TextSetting<T = {}>({
  label,
  dataKey,
  Component = TextInput,
  showCharCount = false,
  charLimit,
  ...props
}: TextInputProps & {
  label: string;
  dataKey: keyof UserData;
  Component?: any;
  showCharCount?: boolean;
  charLimit: number;
} & T) {
  const theme = useMantineTheme();
  const user = useUser();

  const isFirestoreAccessible = user.loggedIn;

  const [inputValue, setInputValue] = useState(
    user.loggedIn ? user.db?.[dataKey] : undefined
  );

  const handleValueChange = useDebouncedCallback((value) => {
    if (user.loggedIn && !user?.db?.admin?.disabledTextFields) {
      user.db.set({ [dataKey]: value });
    }
  }, 2000);

  const memoizedHandleValueChange = useMemo(
    () => handleValueChange,
    [handleValueChange]
  );

  useEffect(() => {
    if (isFirestoreAccessible) setInputValue(user.db?.[dataKey]);
  }, [isFirestoreAccessible, user, dataKey]);

  return (
    <>
      <Component
        value={inputValue}
        label={label}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setInputValue(e.target.value);
          if (e.target.value.length <= charLimit) {
            memoizedHandleValueChange(e.target.value);
          }
        }}
        rightSection={
          isFirestoreAccessible &&
          inputValue?.length &&
          (inputValue?.length > charLimit ? (
            <IconX size={18} color={theme.colors.red[5]} />
          ) : inputValue === user.db?.[dataKey] ? (
            <IconCheck size={18} color={theme.colors.green[5]} />
          ) : (
            <Loader size="xs" />
          ))
        }
        autosize
        {...props}
        error={
          inputValue?.length > charLimit
            ? `${label} must be under ${charLimit} characters`
            : null
        }
        disabled={isFirestoreAccessible && user?.db?.admin?.disableTextFields}
      />
      {showCharCount && (
        <Text align="right" color="dimmed" size="xs" mt="xs">
          Characters: {inputValue?.length}/{charLimit}
        </Text>
      )}
    </>
  );
}

export default TextSetting;
