import { Modal, Group, Title, Button } from "@mantine/core";
import dynamic from "next/dynamic";
import { Dispatch, SetStateAction } from "react";

import Banner from "./Banner";

import { GameCard } from "types/game";

const Bio = dynamic(() => import("./Bio"), {
  ssr: false,
});

function EditProfileModal({
  opened,
  openedFunction,
  cards,
}: {
  opened: boolean;
  openedFunction: Dispatch<SetStateAction<boolean>>;
  cards: GameCard[] | undefined;
}) {
  return (
    <Modal
      opened={opened}
      onClose={() => {
        openedFunction(false);
      }}
      size="lg"
    >
      <Group position="apart" sx={{ margin: 0 }}>
        <Title order={1}>Edit profile</Title>
        <Button
          onClick={() => {
            openedFunction(false);
          }}
        >
          Save
        </Button>
      </Group>
      <Banner cards={cards} />
    </Modal>
  );
}

export default EditProfileModal;
