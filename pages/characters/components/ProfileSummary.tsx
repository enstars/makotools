import {
  Box,
  useMantineTheme,
  Title,
  Text,
  Paper,
  Group,
  Image,
  Stack,
  Checkbox,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

import { CharacterMiniInfo } from "./CharacterMiniInfo";

import Reactions from "components/sections/Reactions";
import { getAssetURL } from "services/data";
import { useDayjs } from "services/libraries/dayjs";
import { GameCharacter } from "types/game";

export function ProfileSummary({
  character,
  renderFaded,
  setRenderFaded,
}: {
  character: GameCharacter;
  renderFaded: boolean;
  setRenderFaded: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { dayjs } = useDayjs();
  return (
    <Box
      id="chara-info-summary"
      sx={{
        zIndex: 3,

        position: "absolute",
        width: 350,
        right: 0,
        top: 180,
        [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
          width: 350,
        },
        [`@media (max-width: ${theme.breakpoints.md}px)`]: {
          width: `75%`,
          marginRight: "25%",
          position: "relative",
          left: 0,
          top: 0,
          right: "unset",
          // minWidth: 300,
        },
      }}
    >
      <Paper
        shadow="md"
        p="md"
        radius="md"
        sx={{
          borderTop: `6px solid ${character.image_color}`,
        }}
      >
        {isMobile && (
          <Group position="right">
            <Checkbox
              size="xs"
              label="Fade render"
              checked={renderFaded}
              onChange={() => setRenderFaded(!renderFaded)}
              color={theme.colorScheme === "dark" ? "dark" : "blue"}
              sx={{
                marginBottom: theme.spacing.md,
              }}
            />
          </Group>
        )}
        <Group
          sx={{
            justifyContent: "space-between",
          }}
        >
          <Title order={3} size="h3">
            Profile
          </Title>
          {character.unit.map((unit) => (
            <Image
              key={unit}
              alt={"unit"}
              src={getAssetURL(`assets/unit_logo_border_${unit}.png`)}
              width={100}
            />
          ))}
        </Group>
        <Stack spacing="xs" mt={6}>
          <CharacterMiniInfo label="Age" info={character.age as number} />
          <CharacterMiniInfo label="Height" info={`${character.height}cm`} />
          <CharacterMiniInfo label="Weight" info={`${character.weight}kg`} />
          <CharacterMiniInfo
            label="School"
            info={(character.school as string[])[0] ?? "--"}
          />
          <CharacterMiniInfo
            label="Birthday"
            info={`${dayjs(character.birthday).format("MMMM D")}`}
          />
          <CharacterMiniInfo label="Blood type" info={character.blood_type} />
          <CharacterMiniInfo info={character.hobby[0]} label="Hobby" />
          <CharacterMiniInfo
            info={character.specialty ? character.specialty[0] : "--"}
            label="Specialty"
          />
          <CharacterMiniInfo
            info={
              character.image_color ? (
                <Group align="center" spacing="xs">
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      backgroundColor: character.image_color,
                      borderRadius: 4,
                      boxShadow: theme.shadows.xs,
                    }}
                  />
                  <Text>{character.image_color.toUpperCase()}</Text>
                </Group>
              ) : (
                "--"
              )
            }
            label="Image color"
          />
          <Reactions fullButton={false} />
        </Stack>
      </Paper>
    </Box>
  );
}
