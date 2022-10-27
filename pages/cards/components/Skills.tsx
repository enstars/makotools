import {
  Badge,
  Box,
  Group,
  Input,
  Slider,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { ReactElement, useState } from "react";

import attributes from "../../../data/attributes.json";
import centerSkill from "../../../data/centerSkill.json";

import { SkillData, GameCard, SkillType } from "types/game";

export function centerSkillParse(skill?: SkillData, fallback = "Unknown") {
  if (typeof skill === "undefined" || !centerSkill[skill.type_id])
    return fallback;
  const { substat, attr } = centerSkill[skill.type_id];
  return `Increases ${substat} of all ${attributes[attr].fullname} cards by ${
    substat === "All" ? 50 : 120
  }%`;
}
export function liveSkillParse(
  skill?: SkillData,
  level: number = 5,
  fallback = "Unknown"
) {
  if (typeof skill === "undefined") return fallback;
  return `Increases the score by ${skill.effect_values[level - 1][0]}% for ${
    skill.effect_values[level - 1][1]
  } seconds.`;
}

const supportSkillDropRates: { [k: number]: string } = {
  5: "small red",
  6: "medium red",
  7: "large red",
  8: "all red",
  9: "small blue",
  10: "medium blue",
  11: "large blue",
  12: "all blue",
  13: "small yellow",
  14: "medium yellow",
  15: "large yellow",
  16: "all yellow",
  28: "all",
};
export function supportSkillParse(
  skill?: SkillData,
  level: number = 3,
  fallback = "Unknown"
) {
  if (typeof skill === "undefined") return fallback;
  switch (skill.type_id) {
    case 1:
      return `Decreases the amount that Voltage lowers after a Bad/Miss.`;
    case 2:
      return `Turns ${skill.effect_values[level - 1][0]} ${
        skill.effect_values[level - 1][1] ? "Bad/Miss" : "Bad"
      } into ${
        ["", "", "", "Good", "Great", "Perfect"][
          skill.effect_values[level - 1][2]
        ]
      }.`;
    case 3:
      return `Turn ${
        skill.effect_values[level - 1][0]
      } Great/Good into a Perfect.`;
    case 4:
      return `Increases the amount that the Ensemble Time Gauge rises after a Good/Great/Perfect.`;
    case 5:
      return `Increases the drop rate of ${
        supportSkillDropRates[skill.type_id]
      } stat pieces by ${skill.effect_values[level - 1][0]}%.`;
    default:
      return fallback;
  }
}

function Skills({ card }: { card: GameCard }) {
  const [liveSkillLevel, setLiveSkillLevel] = useState(5);
  const [supportSkillLevel, setSupportSkillLevel] = useState(3);

  return (
    <>
      <Group
        mt="lg"
        mb="sm"
        sx={(theme) => ({ justifyContent: "space-between" })}
      >
        <Title order={2}>Skills</Title>

        <Group sx={{ flexGrow: 1, maxWidth: 350 }}>
          <Input.Wrapper
            label="Live Lvl."
            sx={{ flex: "2 1 0", minWidth: 150 }}
          >
            <Slider
              label={(l) => `Lvl. ${l}`}
              min={1}
              max={10}
              value={liveSkillLevel}
              onChange={setLiveSkillLevel}
              marks={[
                { value: 1 },
                { value: 5 },
                { value: 6 },
                { value: 7 },
                { value: 9 },
                { value: 10 },
              ]}
              mb="sm"
            />
          </Input.Wrapper>
          <Input.Wrapper
            label="Support Lvl."
            sx={{ flex: "1 1 0", minWidth: 85 }}
          >
            <Slider
              label={(l) => `Lvl. ${l}`}
              min={1}
              max={5}
              value={supportSkillLevel}
              onChange={setSupportSkillLevel}
              marks={[{ value: 3 }, { value: 4 }, { value: 5 }]}
              mb="sm"
            />
          </Input.Wrapper>
        </Group>
      </Group>

      <Stack spacing="xs">
        {[
          {
            type: "center",
            color: "blue",
            description: <Text>{centerSkillParse(card.skills?.center)}</Text>,
          },
          {
            type: "live",
            color: "lightblue",
            description: (
              <Text>
                <Badge
                  mr="xs"
                  variant="dot"
                  color="gray"
                  sx={{
                    verticalAlign: 1,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  Lvl {liveSkillLevel}
                </Badge>
                {liveSkillParse(card.skills?.live, liveSkillLevel)}
              </Text>
            ),
          },
          {
            type: "support",
            color: "green",
            description: (
              <Text>
                <Badge
                  mr="xs"
                  variant="dot"
                  color="gray"
                  sx={{
                    verticalAlign: 1,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  Lvl {supportSkillLevel}
                </Badge>
                {supportSkillParse(card.skills?.support, supportSkillLevel)}
              </Text>
            ),
          },
        ].map(
          (s: {
            type: SkillType;
            color: string;
            description: ReactElement;
          }) => (
            <Group key={s.type} align="start" spacing="xs">
              <Box sx={{ width: 80 }}>
                <Badge sx={{ width: "100%" }} variant="filled" color={s.color}>
                  {s.type}
                </Badge>
              </Box>
              <Box sx={{ flex: "1 1 0", minWidth: 200 }}>
                <Text weight={700}>
                  {card?.skills?.[s.type]?.name?.[0]}{" "}
                  <Text
                    component="span"
                    inline
                    weight={700}
                    size="sm"
                    color="dimmed"
                  >
                    {card?.skills?.[s.type]?.name?.[1] || ""}
                  </Text>
                </Text>

                {s.description}
              </Box>
            </Group>
          )
        )}
      </Stack>
    </>
  );
}

export default Skills;
