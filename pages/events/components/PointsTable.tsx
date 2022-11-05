import { Group, Box, Alert, Space, Paper, Table, Text } from "@mantine/core";
import { IconStar } from "@tabler/icons";
import Link from "next/link";

import gachaCardEventBonus from "../../../data/gachaCardEventBonus.json";

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
      <Group>
        <Box sx={{ position: "relative", flex: "1 1 40%" }}>
          <Link
            href={`/${
              type === "song" || type === "tour" ? "events" : "scouts"
            }/${id}`}
          >
            <Picture
              alt={type === "song" || type === "tour" ? scoutName : eventName}
              srcB2={`assets/card_still_full1_${banner}_evolution.png`}
              sx={{ height: 100 }}
              radius="sm"
            />
          </Link>
        </Box>
        <Box sx={{ flex: "1 1 55%" }}>
          <Alert variant="outline" color="indigo" sx={{ minHeight: 100 }}>
            <Text size="md">
              Cards in the <strong>{scoutName}</strong> scout offer an event
              point bonus for <strong>{eventName}</strong>!
            </Text>
          </Alert>
        </Box>
      </Group>
      <Space h="lg" />
      <Paper withBorder shadow="xs" p="xl">
        <Table striped captionSide="bottom">
          <caption>
            The event bonus range is based on the number of copies of a card
            owned. One copy of a card offers the minimum bonus in a range while
            owning five or more copies offers the maximum bonus.
          </caption>
          <thead>
            <tr>
              <th>Card rarity</th>
              <th>Event point bonus</th>
            </tr>
          </thead>
          {gachaCardEventBonus.map((row) => (
            <tr key={row.rarity}>
              <td>
                {row.rarity}
                <IconStar size={10} />
              </td>
              <td>
                {row.minBonus}% - {row.maxBonus}%
              </td>
            </tr>
          ))}
        </Table>
      </Paper>
    </>
  );
}

export default PointsTable;
