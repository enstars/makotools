import { Space, Paper, Table, Text } from "@mantine/core";
import { IconStar } from "@tabler/icons-react";
import useTranslation from "next-translate/useTranslation";

import gachaCardEventBonus from "data/gachaCardEventBonus.json";

function PointsTable() {
  const { t } = useTranslation("events__event");
  return (
    <>
      <Space h="lg" />
      <Paper withBorder shadow="xs" p="md">
        <Text weight={700} align="center">
          {t("eventPointBonus")}
        </Text>
        <Table striped highlightOnHover captionSide="bottom">
          <thead>
            <tr>
              <th rowSpan={2}>{t("cardRarity")}</th>
              <th colSpan={5} style={{ textAlign: "center" }}>
                {t("cardCopies")}
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
