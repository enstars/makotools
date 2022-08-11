import { useState, useMemo, useEffect } from "react";

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

import { validateUsernameDb } from "../../../services/firebase/firestore";
import { useFirebaseUser } from "../../../services/firebase/user";

function DebouncedUsernameInput({ dataKey = "username", changedCallback }) {
  const theme = useMantineTheme();
  const { firebaseUser, setUserDataKey } = useFirebaseUser();
  const [inputValue, setInputValue] = useState(
    firebaseUser.firestore?.[dataKey]
  );

  const [newUsername, setNewUsername] = useState(
    firebaseUser.firestore?.[dataKey]
  );
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
    setInputValue(firebaseUser.firestore?.[dataKey]);
  }, [firebaseUser, dataKey]);

  const validateUsername = async (value) => {
    setUsernameJudgement(false);
    setNewUsername(null);

    // TODO : move this validation server side
    if (value === firebaseUser.firestore.username) {
      setUsernameMsg("");
      setUsernameJudgement(true);
    } else if (value.replace(/[a-z0-9_]/g, "").length > 0) {
      setUsernameMsg(
        "Username must only contain lowercase alphanumeric characters!"
      );
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
          {...(inputValue === firebaseUser.firestore?.[dataKey]
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
          {...(inputValue !== firebaseUser?.[dataKey] &&
          (usernameJudgement || newUsername)
            ? null
            : { disabled: true })}
        >
          Save
        </Button>
      </Group>
      <Text mt="xs" color="dimmed" size="xs">
        {inputValue !== firebaseUser?.[dataKey] && usernameJudgement
          ? usernameMsg
          : "Pick a new username..."}
      </Text>
    </>
  );
}

export default DebouncedUsernameInput;
