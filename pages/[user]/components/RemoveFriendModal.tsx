import { Button, Group, Modal, Title } from "@mantine/core";
import { showNotification, updateNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons";
import { arrayRemove } from "firebase/firestore";
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
  return (
    <Modal
      centered
      opened={opened}
      onClose={() => closeFunction(false)}
      title={<Title order={2}>Remove friend</Title>}
    >
      Are you sure you want to remove {profile?.name || profile.username} from
      your friends list?
      <Group noWrap position="right" align="center" sx={{ marginTop: 10 }}>
        <Button variant="outline" onClick={() => closeFunction(false)}>
          Cancel
        </Button>
        <Button
          onClick={async () => {
            closeFunction(false);
            showNotification({
              id: "removeFriend",
              loading: true,
              message: "Processing your request...",
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
                message: `${
                  profile?.name || profile.username
                } was successfully removed from your friends list!`,
              });
            } else {
              updateNotification({
                id: "removeFriend",
                loading: false,
                color: "red",
                icon: <IconX size={24} />,
                title: "An error occured:",
                message:
                  "There was an error removing this user from your friends list.",
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
