import { Group, Box, Stack, Title, Text } from "@mantine/core";
import Link from "next/link";

import Picture from "components/core/Picture";
import { GameEvent, ScoutEvent } from "types/game";

function Stories({ content }: { content: GameEvent | ScoutEvent }) {
  return (
    <>
      <Group align="flex-start">
        <Box sx={{ "&&&": { position: "relative", flex: "1 2 45%" } }}>
          <Picture
            alt={content.name[0]}
            srcB2={`assets/card_still_full1_${content.banner_id}_normal.png`}
            sx={{ height: 200 }}
            radius="sm"
          />
        </Box>
        <Box sx={{ "&&&": { flex: "1 1 50%", minWidth: 240 } }}>
          <Stack spacing="xs">
            <Title order={3}>
              {content.story_name && content.story_name[0]}
            </Title>
            <Text color="dimmed">
              {content.intro_lines && content.intro_lines[0]}
            </Text>
            {content.intro_lines_tl_credit &&
              content.intro_lines_tl_credit[0] && (
                <Text align="right" color="dimmed" size="sm">
                  Summary translated by{" "}
                  {
                    <Text
                      component={Link}
                      color="indigo"
                      href={`https://twitter.com/${content.intro_lines_tl_credit[0]}`}
                      target="_blank"
                    >
                      @{content.intro_lines_tl_credit[0]}
                    </Text>
                  }
                </Text>
              )}
          </Stack>
        </Box>
      </Group>
    </>
  );
}

export default Stories;
