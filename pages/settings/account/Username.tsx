import { ActionIcon, Modal, TextInput, useMantineTheme } from "@mantine/core";
import { IconAt, IconPencil } from "@tabler/icons-react";
import { useState } from "react";
import useTranslation from "next-translate/useTranslation";

import DebouncedUsernameInput from "./DebouncedUsernameInput";

import useUser from "services/firebase/user";

function Username() {
  const { t } = useTranslation("settings");
  const { user, userDB } = useUser();
  const theme = useMantineTheme();
  const [usernameModalOpen, setUsernameModalOpen] = useState(false);

  return (
    <>
      <TextInput
        label={t("account.usernameLabel")}
        value={user.loggedIn ? userDB?.username : ""}
        readOnly
        placeholder={t("account.usernamePlaceholder")}
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
        title={t("account.changeUsername")}
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
