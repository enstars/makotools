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

import { GameCard, SkillType } from "types/game";
import {
  centerSkillParse,
  liveSkillParse,
  supportSkillParse,
} from "services/skills";

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

        <Group sx={{ "&&&": { flexGrow: 1, maxWidth: 350 } }}>
          <Input.Wrapper
            label="Live Lvl."
            sx={{ "&&&": { flex: "2 1 0", minWidth: 150 } }}
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
            sx={{ "&&&": { flex: "1 1 0", minWidth: 85 } }}
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
            color: "hokke",
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
                {liveSkillParse(card.skills.live, card.rarity, liveSkillLevel)}
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
                {supportSkillParse(
                  card.skills.support,
                  card.rarity,
                  supportSkillLevel
                )}
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
              <Box sx={{ "&&&": { flex: "1 1 0", minWidth: 200 } }}>
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
