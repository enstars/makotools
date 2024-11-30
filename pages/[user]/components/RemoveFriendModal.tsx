import { Button, Group, Modal, Title } from "@mantine/core";
import { UseMutateFunction } from "@tanstack/react-query";
import useTranslation from "next-translate/useTranslation";
import { Dispatch, SetStateAction } from "react";

import { UserData } from "types/makotools";

function RemoveFriendModal({
  profile,
  opened,
  removeFriendFunction,
  closeFunction,
}: {
  profile: UserData;
  opened: boolean;
  removeFriendFunction: UseMutateFunction<void, Error, void, void>;
  closeFunction: Dispatch<SetStateAction<boolean>>;
}) {
  const { t } = useTranslation("user");
  return (
    <Modal
      centered
      opened={opened}
      onClose={() => closeFunction(false)}
      title={<Title order={2}>{t("removeFriend")}</Title>}
    >
      {t("removeFriendWarning", { enemy: profile?.name || profile.username })}
      <Group noWrap position="right" align="center" sx={{ marginTop: 10 }}>
        <Button variant="outline" onClick={() => closeFunction(false)}>
          {t("cancel")}
        </Button>
        <Button onClick={() => removeFriendFunction()}>Yes</Button>
      </Group>
    </Modal>
  );
}

export default RemoveFriendModal;
