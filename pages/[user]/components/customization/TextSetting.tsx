import {
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  ChangeEvent,
} from "react";
import { TextInput, Text, TextInputProps } from "@mantine/core";
import useTranslation from "next-translate/useTranslation";

import { UserData } from "types/makotools";
import useUser from "services/firebase/user";

function TextSetting<T = {}>({
  label,
  dataKey,
  Component = TextInput,
  showCharCount = false,
  charLimit,
  externalSetter,
  profileState,
  ...props
}: TextInputProps & {
  label: string;
  dataKey: keyof UserData;
  Component?: any;
  showCharCount?: boolean;
  charLimit: number;
  externalSetter: Dispatch<SetStateAction<any>>;
  profileState: any;
} & T) {
  const { t } = useTranslation("user");
  const { user, userDB } = useUser();

  const isFirestoreAccessible = user?.id && userDB;

  const [inputValue, setInputValue] = useState(
    userDB ? String(userDB?.[dataKey]) : undefined
  );

  useEffect(() => {
    if (isFirestoreAccessible) setInputValue(String(userDB?.[dataKey]));
  }, [isFirestoreAccessible, user, dataKey]);

  return (
    <>
      <Component
        value={inputValue}
        label={label}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setInputValue(e.target.value);
          externalSetter({ ...profileState, [dataKey]: e.target.value });
        }}
        {...props}
        error={
          (inputValue?.length ?? 0) > charLimit
            ? `${label} must be under ${charLimit} characters`
            : null
        }
        disabled={isFirestoreAccessible && userDB?.admin?.disableTextFields}
      />
      {showCharCount && (
        <Text align="right" color="dimmed" size="xs" mt="xs">
          {t("characterCount")} {inputValue?.length}/{charLimit}
        </Text>
      )}
    </>
  );
}

export default TextSetting;
