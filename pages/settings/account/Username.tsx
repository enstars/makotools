import { ActionIcon, Modal, TextInput, useMantineTheme } from "@mantine/core";
import { IconAt, IconPencil } from "@tabler/icons-react";
import { useState } from "react";

import DebouncedUsernameInput from "./DebouncedUsernameInput";

import useUser from "services/firebase/user";

function Username() {
  const user = useUser();
  const theme = useMantineTheme();
  const [usernameModalOpen, setUsernameModalOpen] = useState(false);

  return (
    <>
      <TextInput
        label="Username"
        value={user.loggedIn ? user.db?.username : ""}
        readOnly
        placeholder={"Username not set"}
        icon={<IconAt size={16} />}
        sx={{ flexGrow: 1 }}
        rightSection={
          <ActionIcon
            onClick={() => setUsernameModalOpen(true)}
            variant="filled"
            color={theme.primaryColor}
          >
            <IconPencil size={14} />
          </ActionIcon>
        }
      />
      <Modal
        opened={usernameModalOpen}
        onClose={() => setUsernameModalOpen(false)}
        title="Change Username"
        size="sm"
        centered
      >
        <DebouncedUsernameInput
          changedCallback={() => setUsernameModalOpen(false)}
        />
      </Modal>
    </>
  );
}

export default Username;
