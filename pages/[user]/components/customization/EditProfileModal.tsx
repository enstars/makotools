import {
  Modal,
  Group,
  Button,
  Box,
  Text,
  Stack,
  useMantineTheme,
  Accordion,
} from "@mantine/core";
import dynamic from "next/dynamic";
import { Dispatch, SetStateAction } from "react";
import { IconPencil } from "@tabler/icons-react";

import StartPlaying from "../StartPlaying";
import ProfileAvatar from "../profilePicture/ProfileAvatar";
import Favorites from "../Favorites";

import Pronouns from "./Pronouns";
import Name from "./Name";
import Banner from "./Banner";

import { GameCard, GameCharacter, GameUnit } from "types/game";
import { Locale, User, UserData } from "types/makotools";

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
  units,
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
  units: GameUnit[];
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
        title: { width: "100%" },
      })}
      title={
        <Group
          noWrap
          align="center"
          position="apart"
          spacing="xl"
          sx={{ width: "100%" }}
        >
          <Text weight={700}>Edit profile</Text>
        </Group>
      }
      closeOnClickOutside={false}
      closeOnEscape={false}
      withCloseButton={false}
    >
      <Accordion defaultValue="details" variant="contained">
        <Accordion.Item value="banner">
          <Accordion.Control>
            <Text weight={700}>Banner</Text>
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
            <Text weight={700}>Basic Info</Text>
          </Accordion.Control>
          <Accordion.Panel>
            <Group spacing="lg" align="flex-start">
              <Box sx={{ flex: "0 0 120px" }}>
                <Stack align="center" spacing="xs">
                  <ProfileAvatar userInfo={profileState} />
                  <Button
                    variant="subtle"
                    sx={
                      {
                        // position: "absolute",
                        // right: 0,
                        // bottom: 0,
                        // marginRight: 5,
                        // marginTop: 5,
                        // zIndex: 10,
                      }
                    }
                    compact
                    p={4}
                    onClick={() => picModalFunction(true)}
                    leftIcon={<IconPencil size={14} />}
                  >
                    Edit Avatar
                  </Button>
                </Stack>
              </Box>
              <Stack sx={{ "&&&&&": { flex: "1 0 65%" } }} spacing="xs">
                <Name
                  externalSetter={setProfileState}
                  profileState={profileState}
                />
                <Pronouns
                  externalSetter={setProfileState}
                  profileState={profileState}
                />
                <StartPlaying
                  externalSetter={setProfileState}
                  profileState={profileState}
                />
              </Stack>
            </Group>
            <Favorites
              characters={characters}
              units={units}
              profile={profile}
              externalSetter={setProfileState}
              profileState={profileState}
              locale={locale}
            />
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="bio">
          <Accordion.Control>
            <Text weight={700}>Bio</Text>
          </Accordion.Control>
          <Accordion.Panel>
            <Bio externalSetter={setProfileState} profileState={profileState} />
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
      <Group mt="xs" position="right" spacing="xs">
        <Button
          variant="light"
          color="red"
          onClick={() => {
            openedFunction(false);
          }}
        >
          Discard Changes
        </Button>
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
                profile__fave_units: profileState.profile__fave_units,
                profile__show_faves: profileState.profile__show_faves,
              });
            }
            openedFunction(false);
          }}
        >
          Save Changes
        </Button>
      </Group>
    </Modal>
  );
}

export default EditProfileModal;
