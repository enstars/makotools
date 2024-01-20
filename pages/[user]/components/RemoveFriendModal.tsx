import { Button, Group, Modal, Title } from "@mantine/core";
import { showNotification, updateNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { arrayRemove } from "firebase/firestore";
import useTranslation from "next-translate/useTranslation";
import { Dispatch, SetStateAction } from "react";

import { UserData, UserLoggedIn } from "types/makotools";

function RemoveFriendModal({
  user,
  uid,
  profile,
  opened,
  closeFunction,
}: {
  user: UserLoggedIn;
  uid: string;
  profile: UserData;
  opened: boolean;
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
        <Button
          onClick={async () => {
            closeFunction(false);
            showNotification({
              id: "removeFriend",
              loading: true,
              message: t("processingRequest"),
              disallowClose: true,
              autoClose: false,
            });
            const token = await user.user.getIdToken();
            const res = await fetch("/api/friend/delete", {
              method: "POST",
              headers: {
                Authorization: token || "",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ friend: uid }),
            });
            const status = await res.json();
            if (status?.success) {
              user.privateDb.set({
                friends__list: arrayRemove(uid),
              });
              updateNotification({
                id: "removeFriend",
                loading: false,
                color: "lime",
                icon: <IconCheck size={24} />,
                message: t("friendRemoved", {
                  enemy: profile?.name || profile.username,
                }),
              });
            } else {
              updateNotification({
                id: "removeFriend",
                loading: false,
                color: "red",
                icon: <IconX size={24} />,
                title: "An error occured:",
                message: t("removeError"),
              });
            }
          }}
        >
          Yes
        </Button>
      </Group>
    </Modal>
  );
}

export default RemoveFriendModal;
