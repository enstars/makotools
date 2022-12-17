import { Group, Box, Alert, Space, Paper, Table, Text } from "@mantine/core";
import { IconStar } from "@tabler/icons";
import Link from "next/link";

import gachaCardEventBonus from "data/gachaCardEventBonus.json";
import Picture from "components/core/Picture";
import { ID } from "types/game";

function PointsTable({
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
  return (
    <>
      <Group align="stretch">
        <Box sx={{ "&&&": { flex: "1 1 40%", position: "relative" } }}>
          <Link
            href={`/${
              type === "song" || type === "tour" ? "scouts" : "events"
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
          <Alert variant="outline" color="indigo" sx={{ minHeight: 100 }}>
            <Text size="md">
              Cards in the <strong>{scoutName}</strong> scout offer an event
              point bonus for <strong>{eventName}</strong>!
            </Text>
          </Alert>
        </Box>
      </Group>
      <Space h="lg" />
      <Paper withBorder shadow="xs" p="md">
        <Text weight={700} align="center">
          Event point bonus
        </Text>
        <Table striped highlightOnHover captionSide="bottom">
          <thead>
            <tr>
              <th rowSpan={2}>Card rarity</th>
              <th colSpan={5} style={{ textAlign: "center" }}>
                Card Copies
              </th>
            </tr>
            <tr>
              <th>1x</th>
              <th>2x</th>
              <th>3x</th>
              <th>4x</th>
              <th>5x</th>
            </tr>
          </thead>
          <tbody>
            {gachaCardEventBonus.map((row) => (
              <tr key={row.rarity}>
                <td>
                  {row.rarity}
                  <IconStar size={10} />
                </td>
                {row.bonus.map((b) => (
                  <td key={b}>{b}%</td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </Paper>
    </>
  );
}

export default PointsTable;
