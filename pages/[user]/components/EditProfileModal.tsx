import { Modal, Group, Title, Button } from "@mantine/core";
import dynamic from "next/dynamic";
import { Dispatch, SetStateAction } from "react";

import Banner from "./Banner";
import Name from "./Name";
import Pronouns from "./Pronouns";
import StartPlaying from "./StartPlaying";

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
      title={<Title order={2}>Edit profile</Title>}
    >
      <Banner cards={cards} />
      <Group sx={{ marginBottom: 20 }}>
        <Name />
        <Pronouns />
      </Group>
      <StartPlaying />
      <Bio />
      <Button
        onClick={() => {
          openedFunction(false);
        }}
        sx={{ marginTop: 20 }}
      >
        Save
      </Button>
    </Modal>
  );
}

export default EditProfileModal;
