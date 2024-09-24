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
import useTranslation from "next-translate/useTranslation";

import StartPlaying from "../StartPlaying";
import ProfileAvatar from "../profilePicture/ProfileAvatar";
import Favorites from "../Favorites";

import Pronouns from "./Pronouns";
import Name from "./Name";
import Banner from "./Banner";

import { GameCard, GameCharacter, GameUnit } from "types/game";
import { Locale, User, UserData } from "types/makotools";

export type EditingProfile = Pick<
  UserData,
  | "profile__banner"
  | "name"
  | "profile__pronouns"
  | "profile__start_playing"
  | "profile__bio"
  | "profile__picture"
  | "profile__fave_charas"
  | "profile__fave_units"
  | "profile__show_faves"
>;

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
 * @param {EditingProfile} profileState - The state of the current profile that is being edited
 * @param {Dispatch<SetStateAction<any>>} - The setter function that updates profileState
 */
function EditProfileModal({
  opened,
  saveChanges,
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
  saveChanges: any;
  openedFunction: Dispatch<SetStateAction<boolean>>;
  picModalFunction: Dispatch<SetStateAction<boolean>>;
  cards?: GameCard[] | undefined;
  user: User;
  profile: UserData;
  profileState: EditingProfile | undefined;
  setProfileState: Dispatch<SetStateAction<EditingProfile>>;
  characters: GameCharacter[];
  units: GameUnit[];
  locale: Locale;
}) {
  const { t } = useTranslation("user");
  const theme = useMantineTheme();
  if (!opened || !profileState) return null;
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
          <Text weight={700}>{t("editProfile")}</Text>
        </Group>
      }
      closeOnClickOutside={false}
      closeOnEscape={false}
      withCloseButton={false}
    >
      <Accordion defaultValue="details" variant="contained">
        <Accordion.Item value="banner">
          <Accordion.Control>
            <Text weight={700}>{t("banner")}</Text>
          </Accordion.Control>
          <Accordion.Panel>
            <Banner cards={cards} externalSetter={setProfileState} />
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="details">
          <Accordion.Control>
            <Text weight={700}>{t("basicInfo")}</Text>
          </Accordion.Control>
          <Accordion.Panel>
            <Group
              id="icon-group"
              spacing="lg"
              align="flex-start"
              sx={{
                [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
                  flexDirection: "column",
                  alignItems: "center",
                },
              }}
            >
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
                    {t("editAvatar")}
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
            <Text weight={700}>{t("bio")}</Text>
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
          {t("discardChanges")}
        </Button>
        <Button
          onClick={() => {
            saveChanges();
          }}
        >
          {t("saveChanges")}
        </Button>
      </Group>
    </Modal>
  );
}

export default EditProfileModal;
