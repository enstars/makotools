import {
  Box,
  useMantineTheme,
  Paper,
  Tooltip,
  ActionIcon,
  AspectRatio,
  Text,
} from "@mantine/core";
import { IconFriends } from "@tabler/icons-react";
import Link from "next/link";

import { useCharacterColors } from "../[id].page";

import { GameCharacter } from "types/game";
import Picture from "components/core/Picture";
import ResponsiveGrid from "components/core/ResponsiveGrid";
import SectionTitle from "pages/events/[id]/components/SectionTitle";
import { circleKeyToName } from "data/circleKeyToName";

export function CirclesSection({
  characters,
  character,
}: {
  characters: GameCharacter[];
  character: GameCharacter;
}) {
  const theme = useMantineTheme();
  const colors = useCharacterColors();
  return (
    <Box id="circles">
      <SectionTitle
        id="circles"
        title="Circles"
        Icon={IconFriends}
        iconProps={{ color: colors.image }}
      />
      <ResponsiveGrid width={240} sx={{}}>
        {character.circle?.map((circle) => {
          const circleMembers = characters.filter((chara) =>
            chara.circle?.includes(circle)
          );
          const isSmallCircle = circleMembers.length < 6;
          return (
            <Paper
              withBorder
              radius="sm"
              key={circle}
              sx={{
                height: "auto",
                position: "relative",
              }}
            >
              <AspectRatio ratio={1} />
              {/* decorative circles */}
              <Box
                sx={{
                  width: "calc(100% - 50px - 20%)",
                  height: "calc(100% - 50px - 20%)",
                  position: "absolute",
                  borderRadius: "50%",
                  top: "calc(10% + 25px)",
                  left: "calc(10% + 25px)",
                  pointerEvents: "none",
                  background: colors.primary,
                  opacity: 0.05,
                  transform: "scale(1.375)",
                }}
              />
              <Box
                sx={{
                  width: "calc(100% - 50px - 20%)",
                  height: "calc(100% - 50px - 20%)",
                  position: "absolute",
                  borderRadius: "50%",
                  top: "calc(10% + 25px)",
                  left: "calc(10% + 25px)",
                  pointerEvents: "none",
                  textAlign: "center",
                  background: colors.primary,
                  opacity: 0.05,
                  transform: "scale(1)",
                }}
              />
              {circleMembers.map((member, i) => {
                const positionInCircle = circleMembers
                  .map((c) => c.character_id)
                  .indexOf(character.character_id);
                const angle =
                  (360 * (i - positionInCircle)) / circleMembers.length - 90;
                return (
                  <Box
                    key={member.character_id}
                    sx={{
                      width: "100%",
                      height: "100%",
                      position: "absolute",
                      top: 0,
                      left: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "right",
                      paddingRight: "10%",
                      transform: `rotate(${angle}deg)`,
                      pointerEvents: "none",
                    }}
                  >
                    <Tooltip
                      key={member.character_id}
                      label={`${member.first_name[0]}${
                        member.last_name[0] ? ` ${member.last_name[0]}` : ""
                      }`}
                      sx={{ pointerEvents: "all" }}
                      withinPortal
                    >
                      <ActionIcon
                        component={Link}
                        href={`/characters/${member.character_id}`}
                        variant="subtle"
                        size={50}
                        radius={25}
                        sx={{
                          background: "none",
                          border: "none",
                          pointerEvents: "all",
                          transform: `rotate(${-angle}deg) scale(${
                            isSmallCircle ? 1.25 : 1
                          })`,
                          ["&:hover"]: {
                            transform: `rotate(${-angle}deg) scale(${
                              isSmallCircle ? 1.35 : 1.1
                            })`,
                          },
                        }}
                      >
                        <Picture
                          transparent
                          srcB2={`assets/character_sd_square1_${member.character_id}.png`}
                          alt={member.first_name[0]}
                          fill={false}
                          width={50}
                          height={50}
                          sx={{
                            pointerEvents: "none",
                          }}
                        />
                      </ActionIcon>
                    </Tooltip>
                  </Box>
                );
              })}
              <Box
                sx={{
                  color: colors.primary,

                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "none",
                  padding: "0 33%",
                  textAlign: "center",
                }}
              >
                <Text size="sm" weight={700}>
                  {circleKeyToName[circle as keyof typeof circleKeyToName] ??
                    circle}
                </Text>
              </Box>
            </Paper>
          );
        })}
      </ResponsiveGrid>
    </Box>
  );
}
