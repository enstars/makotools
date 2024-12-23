import { Group, Box, Stack, Title, Text, useMantineTheme } from "@mantine/core";
import Link from "next/link";
import useTranslation from "next-translate/useTranslation";

import Picture from "components/core/Picture";
import { Event, Scout } from "types/game";

function Stories({ content }: { content: Event | Scout }) {
  const { t } = useTranslation("events__event");
  const theme = useMantineTheme();
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
              {content.story_name &&
                content.story_name.filter((name) => name !== null)[0]}
            </Title>
            <Text color="dimmed">
              {content.intro_lines &&
                content.intro_lines.filter((lines) => lines !== null)[0]}
            </Text>
            {content.intro_lines_tl_credit &&
              content.intro_lines_tl_credit[0] && (
                <Text align="right" color="dimmed" size="sm">
                  {t("translationCredit")}{" "}
                  {
                    <Text
                      component={Link}
                      color={theme.primaryColor}
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
