import {
  ActionIcon,
  Box,
  Card,
  createStyles,
  Paper,
  Text,
  Tooltip,
} from "@mantine/core";
import Link from "next/link";
import { IconBookmark, IconHistory, IconHourglassHigh } from "@tabler/icons";

import Picture from "components/core/Picture";
import { useDayjs } from "services/libraries/dayjs";
import { Scout } from "types/game";

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

function ScoutCard({ scout }: { scout: Scout }) {
  const { dayjs } = useDayjs();
  const { classes } = useStyles();

  return (
    <Card withBorder>
      <Card.Section
        component={Link}
        href={`/scouts/${scout.gacha_id}`}
        sx={{ position: "relative" }}
      >
        {dayjs(scout.end.en).isBefore(dayjs()) && (
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
              Past
            </Text>
          </Paper>
        )}
        {dayjs().isBetween(dayjs(scout.start.en), dayjs(scout.end.en)) && (
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
              Ongoing
            </Text>
          </Paper>
        )}
        {
          <Tooltip position="bottom" label="Bookmark this scout">
            <ActionIcon
              sx={(theme) => ({
                position: "absolute",
                top: 9,
                right: 3,
                zIndex: 12,
              })}
            >
              <IconBookmark
                strokeWidth={2}
                color="white"
                style={{ filter: "drop-shadow(0px 0px 1px rgb(0 0 0))" }}
              />
            </ActionIcon>
          </Tooltip>
        }
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
        <Text size="xs" weight={500} color="dimmed">
          {dayjs(scout.start.en).format("ll")}
          {" - "}
          {dayjs(scout.end.en).format("ll")}
        </Text>
      </Card.Section>
    </Card>
  );
}

export default ScoutCard;
