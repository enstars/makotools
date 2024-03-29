import {
  Box,
  BoxProps,
  Button,
  Drawer,
  Group,
  ScrollArea,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { useState } from "react";
import useTranslation from "next-translate/useTranslation";

import { sumStats } from "services/game";
import CardStatsNumber from "components/utilities/formatting/CardStatsNumber";
import { GameCard, StatLevel } from "types/game";

function LabelCell({ total, ...props }: BoxProps & { total?: any }) {
  return (
    <Box
      component={"td"}
      sx={(theme) => ({
        "&&": {
          textTransform: "uppercase",
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
function StatCell({
  header,
  total,
  children,
  ...props
}: BoxProps & {
  header?: boolean;
  total?: any;
  children?: any;
}) {
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
function BigData({ data, label }: { data: any; label: string }) {
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

export default function Stats({ card }: { card: GameCard }) {
  const { t } = useTranslation("cards__card");
  const [opened, setOpened] = useState(false);
  return (
    <>
      <Group
        mt="lg"
        mb="sm"
        sx={(theme) => ({ justifyContent: "space-between" })}
      >
        <Title order={2} sx={{ flexGrow: 1 }}>
          {t("stats.heading")}
        </Title>
        <Button variant="subtle" onClick={() => setOpened(true)}>
          {t("stats.showDetailedStats")}
        </Button>
      </Group>
      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        title={t("stats.detailedStats")}
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
                <StatCell header />
                <StatCell header>Da</StatCell>
                <StatCell header>Vo</StatCell>
                <StatCell header>Pf</StatCell>
                <StatCell header>Total</StatCell>
              </tr>
            </thead>
            <tbody>
              {["min", "max", "ir", "ir1", "ir2", "ir3", "ir4"].map(
                (p: StatLevel) => {
                  const stats = card.stats?.[p];
                  if (stats) {
                    const { da, vo, pf } = stats;
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
                }
              )}
            </tbody>
          </Table>
        </ScrollArea>
      </Drawer>
      <Group mb="md">
        <BigData
          label={`${t("stats.maxStats")} (1 copy)`}
          data={<CardStatsNumber>{sumStats(card.stats?.ir)}</CardStatsNumber>}
        />
        <BigData
          label={`${t("stats.maxStats")} (3 copies)`}
          data={<CardStatsNumber>{sumStats(card.stats?.ir2)}</CardStatsNumber>}
        />
        <BigData
          label={`${t("stats.maxStats")} (5 copies)`}
          data={<CardStatsNumber>{sumStats(card.stats?.ir4)}</CardStatsNumber>}
        />
      </Group>
    </>
  );
}
