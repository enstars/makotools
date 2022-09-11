import { ActionIcon, Modal, TextInput } from "@mantine/core";
import { IconAt, IconPencil } from "@tabler/icons";
import { useState } from "react";

import { useFirebaseUser } from "../../../services/firebase/user";

import DebouncedUsernameInput from "./DebouncedUsernameInput";

function Username() {
  const { firebaseUser } = useFirebaseUser();
  const [usernameModalOpen, setUsernameModalOpen] = useState(false);

  return (
    <>
      <TextInput
        label="Username"
        value={firebaseUser.firestore?.username}
        disabled
        description="Username changes are unavailable during the beta."
        placeholder={"Username not set"}
        icon={<IconAt size={16} />}
        sx={{ flexGrow: 1 }}
        rightSection={
          <ActionIcon
            onClick={() => setUsernameModalOpen(true)}
            variant="filled"
            color="blue"
            disabled //temporarily
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
