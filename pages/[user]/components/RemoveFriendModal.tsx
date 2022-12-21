import { Button, Group, Modal, Title } from "@mantine/core";
import { Dispatch, SetStateAction } from "react";

import { User, UserData } from "types/makotools";

function RemoveFriendModal({
  user,
  profile,
  opened,
  closeFunction,
}: {
  user: User;
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
        <Button>Yes</Button>
        <Button variant="outline" onClick={() => closeFunction(false)}>
          Cancel
        </Button>
      </Group>
    </Modal>
  );
}

export default RemoveFriendModal;
