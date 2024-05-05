import {
  Box,
  Card,
  createStyles,
  Paper,
  Text,
  useMantineTheme,
} from "@mantine/core";
import Link from "next/link";
import { IconHistory, IconHourglassHigh } from "@tabler/icons-react";
import useTranslation from "next-translate/useTranslation";

import Picture from "components/core/Picture";
import { useDayjs } from "services/libraries/dayjs";
import { GameRegion, Scout } from "types/game";
import BookmarkButton from "components/core/BookmarkButton";

const useStyles = createStyles((theme, _params, getRef) => ({
  scoutInfo: {
    padding: "10px",

    "&:link": {
      color: "inherit",
      textDecoration: "none",
    },

    "&:visited": {
      color: "inherit",
    },
  },
}));

function ScoutCard({ scout, region }: { scout: Scout; region: GameRegion }) {
  const { t } = useTranslation("scouts");
  const theme = useMantineTheme();
  const { dayjs } = useDayjs();
  const { classes } = useStyles();

  const unknownDate = !scout.start[region] || !scout.end[region];

  return (
    <Card withBorder sx={{ position: "relative" }} p={0}>
      <BookmarkButton
        id={scout.gacha_id}
        type="scout"
        mr={theme.spacing.xs}
        onBusyBackground
      />
      <Card.Section
        component={Link}
        href={`/scouts/${scout.gacha_id}`}
        sx={{ position: "relative", top: 0 }}
      >
        {!unknownDate && dayjs(scout.end?.[region]).isBefore(dayjs()) && (
          <Paper
            component={Box}
            sx={(theme) => ({
              position: "absolute",
              top: 9,
              left: -12.5,
              borderTopRightRadius: theme.radius.sm,
              borderBottomRightRadius: theme.radius.sm,
              transform: "skew(-15deg)",
              pointerEvents: "none",
              zIndex: 12,
              background: theme.colors.orange[7],
            })}
            pl={20}
            pr={10}
            py={2}
            radius={0}
          >
            <Text
              size="xs"
              weight="700"
              sx={{
                textTransform: "uppercase",
                transform: "skew(15deg)",
                fontFeatureSettings: "'kern' 1, 'ss02' 1",
              }}
              color="white"
            >
              <IconHistory
                size={10}
                strokeWidth={3}
                style={{ verticalAlign: -1, marginRight: 2 }}
              />
              {t("past")}
            </Text>
          </Paper>
        )}
        {!unknownDate &&
          dayjs().isBetween(
            dayjs(scout.start?.[region]),
            dayjs(scout.end?.[region])
          ) && (
            <Paper
              component={Box}
              sx={(theme) => ({
                position: "absolute",
                top: 9,
                left: -12.5,
                borderTopRightRadius: theme.radius.sm,
                borderBottomRightRadius: theme.radius.sm,
                transform: "skew(-15deg)",
                pointerEvents: "none",
                zIndex: 12,
                background: theme.colors.green[7],
              })}
              pl={20}
              pr={10}
              py={2}
              radius={0}
            >
              <Text
                size="xs"
                weight="700"
                sx={{
                  textTransform: "uppercase",
                  transform: "skew(15deg)",
                  fontFeatureSettings: "'kern' 1, 'ss02' 1",
                }}
                color="white"
              >
                <IconHourglassHigh
                  size={10}
                  strokeWidth={3}
                  style={{ verticalAlign: -1, marginRight: 2 }}
                />
                {t("ongoing")}
              </Text>
            </Paper>
          )}
        <Picture
          alt={scout.name[0]}
          srcB2={`assets/card_still_full1_${scout.banner_id}_evolution.png`}
          sx={{ height: 100 }}
        />
      </Card.Section>
      <Card.Section
        component={Link}
        href={`/scouts/${scout.gacha_id}`}
        className={classes.scoutInfo}
      >
        <Text weight={700}>{scout.name[0]}</Text>
        {unknownDate ? (
          <Text size="xs" weight={500} color="dimmed">
            {t("scout.dateUnknown")}
          </Text>
        ) : (
          <Text size="xs" weight={500} color="dimmed">
            {dayjs(scout.start?.[region]).format("ll")}
            {" - "}
            {dayjs(scout.end?.[region]).format("ll")}
          </Text>
        )}
      </Card.Section>
    </Card>
  );
}

export default ScoutCard;
