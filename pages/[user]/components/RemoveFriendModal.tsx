import { Button, Group, Modal, Title } from "@mantine/core";
import { arrayRemove } from "firebase/firestore";
import { Dispatch, SetStateAction } from "react";

import notify from "services/libraries/notify";
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
            const token = await user.user.getIdToken();
            const res = await fetch("/api/friendAccept", {
              method: "DELETE",
              headers: {
                Authorization: token || "",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ friend: uid }),
            });
            const status = await res.json();
            console.log(status);
            if (status?.success) {
              user.privateDb.set({
                friends__list: arrayRemove(uid),
              });
            } else {
              notify("error", {
                title: "Error",
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
