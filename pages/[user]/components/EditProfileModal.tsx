import { Modal, Group, Title, Button, Divider } from "@mantine/core";
import dynamic from "next/dynamic";
import { Dispatch, SetStateAction } from "react";

import Banner from "./Banner";
import Name from "./Name";
import Pronouns from "./Pronouns";
import StartPlaying from "./StartPlaying";

import { GameCard } from "types/game";
import { User, UserData } from "types/makotools";

const Bio = dynamic(() => import("./Bio"), {
  ssr: false,
});

function EditProfileModal({
  opened,
  openedFunction,
  cards,
  user,
  profile,
  profileState,
  setProfileState,
}: {
  opened: boolean;
  openedFunction: Dispatch<SetStateAction<boolean>>;
  cards: GameCard[] | undefined;
  user: User;
  profile: UserData;
  profileState: any;
  setProfileState: Dispatch<SetStateAction<any>>;
}) {
  return (
    <Modal
      opened={opened}
      onClose={() => {
        openedFunction(false);
      }}
      size="lg"
      styles={(theme) => ({
        root: { marginBottom: 10, marginTop: -25 },
        title: { width: "80%" },
      })}
      title={
        <Group
          noWrap
          align="center"
          position="left"
          spacing="xl"
          sx={{ width: "100%" }}
        >
          <Title order={2}>Edit profile</Title>
          <Button
            onClick={() => {
              if (user.loggedIn) {
                user.db.set({
                  profile__banner: profileState.profile__banner,
                  name: profileState.name,
                  profile__pronouns: profileState.profile__pronouns,
                  profile__start_playing: profileState.profile__start_playing,
                  profile__bio: profileState.profile__bio,
                });
              }
              openedFunction(false);
              location.reload();
            }}
          >
            Save
          </Button>
        </Group>
      }
    >
      <Banner
        cards={cards}
        externalSetter={setProfileState}
        profileState={profileState}
      />
      <Divider sx={{ margin: "20px 0px" }} />
      <Group sx={{ marginBottom: 20 }}>
        <Name externalSetter={setProfileState} profileState={profileState} />
        <Pronouns
          externalSetter={setProfileState}
          profileState={profileState}
        />
      </Group>
      <StartPlaying
        externalSetter={setProfileState}
        profileState={profileState}
      />
      <Divider sx={{ margin: "20px 0px" }} />
      <Bio externalSetter={setProfileState} profileState={profileState} />
    </Modal>
  );
}

export default EditProfileModal;
