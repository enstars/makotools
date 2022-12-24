import {
  Modal,
  Group,
  Title,
  Button,
  Image,
  Divider,
  Box,
  Text,
  Stack,
  ActionIcon,
  useMantineTheme,
} from "@mantine/core";
import dynamic from "next/dynamic";
import { Dispatch, SetStateAction } from "react";
import { IconPencil } from "@tabler/icons";

import MaoBanned from "../MaoBanned.png";

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
  picModalFunction,
  cards,
  user,
  profile,
  profileState,
  setProfileState,
}: {
  opened: boolean;
  openedFunction: Dispatch<SetStateAction<boolean>>;
  picModalFunction: Dispatch<SetStateAction<boolean>>;
  cards: GameCard[] | undefined;
  user: User;
  profile: UserData;
  profileState: any;
  setProfileState: Dispatch<SetStateAction<any>>;
}) {
  const theme = useMantineTheme();
  return (
    <Modal
      opened={opened}
      onClose={() => {
        openedFunction(false);
      }}
      size="lg"
      styles={(theme) => ({
        root: { marginBottom: 10, marginTop: -25 },
        modal: { maxHeight: "100%", height: "100%", padding: "5 0" },
        title: { width: "80%" },
        body: {
          position: "relative",
          width: "100%",
          height: "95%",
          maxHeight: "100%",
          overflowY: "scroll",
          scrollbarWidth: "none",
        },
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
      <Group position="apart" spacing="xl" sx={{ marginBottom: 20 }}>
        <Box sx={{ flex: "0 0 120px" }}>
          <Text align="center">Avatar</Text>
          <Box sx={{ position: "relative" }}>
            <ActionIcon
              variant="filled"
              color={theme.primaryColor}
              sx={{
                position: "absolute",
                right: 0,
                marginRight: 5,
                marginTop: 5,
                zIndex: 10,
              }}
              radius="xl"
              size="lg"
              p={4}
              onClick={() => picModalFunction(true)}
            >
              <IconPencil size={28} />
            </ActionIcon>
            <Image
              src={MaoBanned.src}
              alt={profile.username}
              width={120}
              height={120}
              styles={(theme) => ({
                image: {
                  borderRadius: 60,
                  border: `3px solid ${theme.colors[theme.primaryColor][4]}`,
                },
              })}
            />
          </Box>
        </Box>
        <Stack sx={{ flex: "1 0 25%" }}>
          <Name externalSetter={setProfileState} profileState={profileState} />
          <Pronouns
            externalSetter={setProfileState}
            profileState={profileState}
          />
        </Stack>
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
