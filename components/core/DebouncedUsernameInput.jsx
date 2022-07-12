import { useState, useMemo, useEffect } from "react";
import { useUserData } from "../../services/userData";
import { validateUsernameDb } from "../../services/firebase";
import { useDebouncedCallback } from "use-debounce";

import {
  TextInput,
  Button,
  Loader,
  Text,
  Group,
  useMantineTheme,
} from "@mantine/core";
import { IconCheck, IconX, IconAt } from "@tabler/icons";

function DebouncedUsernameInput({ dataKey = "username", changedCallback }) {
  const theme = useMantineTheme();
  const { userData, setUserDataKey } = useUserData();
  const [inputValue, setInputValue] = useState(userData?.[dataKey]);

  const [newUsername, setNewUsername] = useState(userData?.[dataKey]);
  const [usernameMsg, setUsernameMsg] = useState("");
  const [usernameJudgement, setUsernameJudgement] = useState(true);

  const handleValueChange = useDebouncedCallback((value) => {
    validateUsername(value);
  }, 1000);

  const memoizedHandleValueChange = useMemo(
    () => handleValueChange,
    [handleValueChange]
  );

  useEffect(() => {
    setInputValue(userData?.[dataKey]);
  }, [userData, dataKey]);

  const validateUsername = async (value) => {
    setUsernameJudgement(false);
    setNewUsername(null);
    if (value === userData.username) {
      setUsernameMsg("");
      setUsernameJudgement(true);
    } else if (value.replace(/[A-z0-9_]/g, "").length > 0) {
      setUsernameMsg("Username must only contain alphanumeric characters!");
      setUsernameJudgement(true);
    } else if (value.length === 0) {
      setUsernameMsg("Username cannot be empty!");
      setUsernameJudgement(true);
    } else if (value.length < 4) {
      setUsernameMsg("Username too short!");
      setUsernameJudgement(true);
    } else if (value.length > 15) {
      setUsernameMsg("Username too long!");
      setUsernameJudgement(true);
    } else {
      const usernameValid = await validateUsernameDb(value);
      if (!usernameValid) {
        setUsernameMsg("Username is taken!");
        setUsernameJudgement(true);
      } else {
        setNewUsername(value);
        setUsernameMsg("Username is available!");
        setUsernameJudgement(true);
      }
    }
  };

  const validateAndSaveUsername = () => {
    setUserDataKey({ [dataKey]: newUsername });
    setNewUsername(null);
    changedCallback();
  };

  //   const memoizedHandleUsernameChange = useMemo(() => handleUsernameChange, []);

  return (
    <>
      <Group spacing="xs" sx={{ flexWrap: "nowrap" }}>
        <TextInput
          value={inputValue}
          icon={<IconAt size="16" />}
          onChange={(e) => {
            setUsernameJudgement(false);
            setInputValue(e.target.value);
            memoizedHandleValueChange(e.target.value);
          }}
          // {...(userData.loading && { disabled: true })}
          {...(inputValue === userData?.[dataKey]
            ? null
            : !usernameJudgement
            ? { rightSection: <Loader size="xs" /> }
            : newUsername
            ? {
                rightSection: (
                  <IconCheck size={18} color={theme.colors.green[5]} />
                ),
              }
            : {
                rightSection: <IconX size={18} color={theme.colors.red[5]} />,
                error: true,
              })}
          sx={{ flexGrow: 1 }}
        />
        <Button
          onClick={validateAndSaveUsername}
          {...(inputValue !== userData?.[dataKey] &&
          (usernameJudgement || newUsername)
            ? null
            : { disabled: true })}
        >
          Save
        </Button>
      </Group>
      <Text mt="xs" color="dimmed" size="xs">
        {inputValue !== userData?.[dataKey] && usernameJudgement
          ? usernameMsg
          : "Pick a new username..."}
      </Text>
    </>
  );
}

export default DebouncedUsernameInput;
