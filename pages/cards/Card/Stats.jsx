import {
  Box,
  Button,
  Drawer,
  Group,
  ScrollArea,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { useState } from "react";
import CardStatsNumber from "../../../components/core/CardStatsNumber";

function LabelCell({ total, ...props }) {
  return (
    <Box
      component={"td"}
      sx={(theme) => ({
        "&&": {
          // textAlign: "right",
          // fontVariantCaps: "small-caps",
          textTransform: "uppercase",
          //   fontWeight: total ? 800 : 400,
          fontFeatureSettings: "'kern' 1, 'ss02' 1",
          fontSize: theme.fontSizes.xs,
          fontWeight: 900,
          paddingTop: theme.spacing.xs / 1.5,
          paddingBottom: theme.spacing.xs / 1.5,
        },
      })}
      {...props}
    />
  );
}
function StatCell({ header, total, children, ...props }) {
  return (
    <Box
      component={header ? "th" : "td"}
      sx={(theme) => ({
        "&&": {
          textAlign: "right",
          paddingTop: theme.spacing.xs / 1.5,
          paddingBottom: theme.spacing.xs / 1.5,
          fontVariantNumeric: "tabular-nums",
          fontWeight: total || header ? 800 : 400,
        },
      })}
      {...props}
    >
      {children === "?" ? (
        <Text inherit color="dimmed">
          ???
        </Text>
      ) : (
        <CardStatsNumber>{children}</CardStatsNumber>
      )}
    </Box>
  );
}
function BigData({ data, label }) {
  return (
    <Box sx={{ flexGrow: 1, flexBasis: 150 }}>
      <Text size="sm" color="dimmed" weight={700}>
        {label}
      </Text>
      <Text
        weight={900}
        sx={(theme) => ({
          fontSize: theme.fontSizes.xl * 1.5,
          fontFamily: theme.headings.fontFamily,
        })}
      >
        {data}
      </Text>
    </Box>
  );
}

function sumStats(stats, fallback = "?") {
  const sum = stats?.da + stats?.vo + stats?.pf;
  if (!stats?.da) return fallback;
  return sum;
}
export { sumStats };

function Stats({ card }) {
  const [opened, setOpened] = useState(false);
  return (
    <>
      <Group
        mt="lg"
        mb="sm"
        sx={(theme) => ({ justifyContent: "space-between" })}
      >
        <Title order={2} sx={{ flexGrow: 1 }}>
          Stats
        </Title>
        <Button variant="subtle" onClick={() => setOpened(true)}>
          Show detailed stats
        </Button>
      </Group>
      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        title="Detailed stats"
        padding="md"
        size="lg"
        position="bottom"
        styles={(theme) => ({
          header: { margin: "auto", maxWidth: theme.breakpoints.xs },
          drawer: {
            margin: "auto",
            maxWidth: theme.breakpoints.xs,
            borderTopLeftRadius: theme.radius.md,
            borderTopRightRadius: theme.radius.md,
          },
        })}
        // radius="md"
      >
        <ScrollArea
          offsetScrollbars
          sx={{ maxWidth: "100%" }}
          type="auto"
          scrollbarSize={5}
          mt="xs"
        >
          <Table
            striped
            highlightOnHover
            sx={(theme) => ({ margin: "auto", maxWidth: theme.breakpoints.xs })}
          >
            <thead>
              <tr>
                <StatCell header></StatCell>
                <StatCell header>Da</StatCell>
                <StatCell header>Vo</StatCell>
                <StatCell header>Pf</StatCell>
                <StatCell header>Total</StatCell>
              </tr>
            </thead>
            <tbody>
              {["min", "max", "ir", "ir1", "ir2", "ir3", "ir4"].map((p) => {
                if (card.main.stats?.[p].da) {
                  const { da, vo, pf } = card.main.stats?.[p];
                  const sum = da + vo + pf;
                  return (
                    <tr key={p}>
                      <LabelCell>{p}</LabelCell>
                      <StatCell>{da || "?"}</StatCell>
                      <StatCell>{vo || "?"}</StatCell>
                      <StatCell>{pf || "?"}</StatCell>
                      <StatCell total>{sum || "?"}</StatCell>
                    </tr>
                  );
                }
                return (
                  <tr key={p}>
                    <LabelCell>{p}</LabelCell>
                    <StatCell>?</StatCell>
                    <StatCell>?</StatCell>
                    <StatCell>?</StatCell>
                    <StatCell>?</StatCell>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </ScrollArea>
      </Drawer>
      <Group mb="md">
        <BigData
          label="Max stats (1 copy)"
          data={
            <CardStatsNumber>{sumStats(card.main.stats?.ir)}</CardStatsNumber>
          }
        />
        <BigData
          label="Max stats (3 copies)"
          data={
            <CardStatsNumber>{sumStats(card.main.stats?.ir2)}</CardStatsNumber>
          }
        />
        <BigData
          label="Max stats (5 copies)"
          data={
            <CardStatsNumber>{sumStats(card.main.stats?.ir4)}</CardStatsNumber>
          }
        />
      </Group>
    </>
  );
}

export default Stats;
