import { Alert, Box, Group, Text, useMantineTheme } from "@mantine/core";
import Link from "next/link";
import Trans from "next-translate/Trans";

import { ID } from "types/game";
import Picture from "components/core/Picture";

export default function ScoutPointsSummary({
  id,
  type,
  eventName,
  scoutName,
  banner,
}: {
  id: ID;
  type: string;
  eventName: string;
  scoutName: string;
  banner: ID;
}) {
  const theme = useMantineTheme();
  return (
    <Group align="stretch">
      <Box sx={{ "&&&": { flex: "1 1 40%", position: "relative" } }}>
        <Link
          href={`/${
            type === "song" || type === "tour" || type === "shuffle"
              ? "scouts"
              : "events"
          }/${id}`}
        >
          <Picture
            alt={type === "song" || type === "tour" ? scoutName : eventName}
            srcB2={`assets/card_still_full1_${banner}_evolution.png`}
            sx={{ height: "100%", minHeight: 100 }}
            radius="sm"
          />
        </Link>
      </Box>
      <Box sx={{ "&&&": { flex: "1 1 55%", minWidth: 240 } }}>
        <Alert
          variant="outline"
          color={theme.primaryColor}
          sx={{ minHeight: 100 }}
        >
          <Text size="md">
            <Trans
              i18nKey="events__event:ptSummary"
              components={[<strong key="strong" />]}
              values={{ scout: scoutName, event: eventName }}
            />
          </Text>
        </Alert>
      </Box>
    </Group>
  );
}
