import {
  Modal,
  Group,
  Title,
  Button,
  Box,
  Text,
  Stack,
  ActionIcon,
  useMantineTheme,
  Accordion,
} from "@mantine/core";
import dynamic from "next/dynamic";
import { Dispatch, SetStateAction } from "react";
import { IconPencil } from "@tabler/icons";

import MaoBanned from "../MaoBanned.png";

import Banner from "./Banner";
import Name from "./Name";
import Pronouns from "./Pronouns";
import StartPlaying from "./StartPlaying";
import ProfileAvatar from "./ProfileAvatar";
import FavoriteCharacters from "./FavoriteCharacters";

import { GameCard, GameCharacter } from "types/game";
import { Locale, User, UserData } from "types/makotools";
import { getAssetURL } from "services/data";

const Bio = dynamic(() => import("./Bio"), {
  ssr: false,
});

/** Modal for editing the profile
 * @param {boolean} opened - Whether the modal is currently opened or not
 * @param {Dispatch<SetStateAction<boolean>} openedFunction - The function that toggles the opened parameter
 * @param {Dispatch<SetStateAction<boolean>} picModalFunction - Function that opens and closes ProfilePicModal
 * @param {GameCard[]} cards - Array of available cards in game for the profile banner
 * @param {User} user - Object for the currently logged-in user
 * @param {UserData} profile - The profile that is currently being viewed
 * @param {any} profileState - The state of the current profile that is being edited
 * @param {Dispatch<SetStateAction<any>>} - The setter function that updates profileState
 */
function EditProfileModal({
  opened,
  openedFunction,
  picModalFunction,
  cards,
  user,
  profile,
  profileState,
  setProfileState,
  characters,
  locale,
}: {
  opened: boolean;
  openedFunction: Dispatch<SetStateAction<boolean>>;
  picModalFunction: Dispatch<SetStateAction<boolean>>;
  cards?: GameCard[] | undefined;
  user: User;
  profile: UserData;
  profileState: any;
  setProfileState: Dispatch<SetStateAction<any>>;
  characters: GameCharacter[];
  locale: Locale;
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
                  profile__picture: profileState.profile__picture,
                  profile__fave_charas: profileState.profile__fave_charas,
                });
              }
              openedFunction(false);
            }}
          >
            Save
          </Button>
        </Group>
      }
    >
      <Accordion defaultValue={"details"}>
        <Accordion.Item value="banner">
          <Accordion.Control>
            <Text size="xl" weight={700}>
              Banner cards
            </Text>
          </Accordion.Control>
          <Accordion.Panel>
            <Banner
              cards={cards}
              externalSetter={setProfileState}
              profileState={profileState}
            />
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="details">
          <Accordion.Control>
            <Text size="xl" weight={700}>
              Profile details
            </Text>
          </Accordion.Control>
          <Accordion.Panel>
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
                  <ProfileAvatar
                    src={
                      profileState.profile__picture
                        ? getAssetURL(
                            `assets/card_still_full1_${Math.abs(
                              profileState.profile__picture.id
                            )}_${
                              profileState.profile__picture.id > 0
                                ? "evolution"
                                : "normal"
                            }.png`
                          )
                        : MaoBanned.src
                    }
                    crop={
                      profileState.profile__picture
                        ? profileState.profile__picture.crop
                        : undefined
                    }
                    border={`5px solid ${theme.colors[theme.primaryColor][4]}`}
                  />
                </Box>
              </Box>
              <Stack sx={{ flex: "1 0 25%" }}>
                <Name
                  externalSetter={setProfileState}
                  profileState={profileState}
                />
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
            <FavoriteCharacters
              characters={characters}
              profile={profile}
              externalSetter={setProfileState}
              profileState={profileState}
              locale={locale}
            />
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="bio">
          <Accordion.Control>
            <Text size="xl" weight={700}>
              Bio
            </Text>
          </Accordion.Control>
          <Accordion.Panel>
            <Bio externalSetter={setProfileState} profileState={profileState} />
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Modal>
  );
}

export default EditProfileModal;
