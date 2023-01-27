import {
  ActionIcon,
  Box,
  Card,
  createStyles,
  Paper,
  Text,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import Link from "next/link";
import { IconBookmark, IconHistory, IconHourglassHigh } from "@tabler/icons";
import { UseListStateHandlers, useMediaQuery } from "@mantine/hooks";

import Picture from "components/core/Picture";
import { useDayjs } from "services/libraries/dayjs";
import { Scout } from "types/game";
import useUser from "services/firebase/user";

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

function ScoutCard({
  scout,
  bookmarked,
  bookmarks,
  bookmarkHandlers,
}: {
  scout: Scout;
  bookmarked: boolean;
  bookmarks: number[];
  bookmarkHandlers: UseListStateHandlers<number>;
}) {
  const user = useUser();
  const theme = useMantineTheme();
  const { dayjs } = useDayjs();
  const { classes } = useStyles();
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <Card withBorder sx={{ position: "relative" }} p={0}>
      {user.loggedIn && (
        <Tooltip
          position="bottom"
          label={bookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
        >
          <ActionIcon
            sx={(theme) => ({
              position: "absolute",
              top: 0,
              right: 3,
              zIndex: 12,
            })}
            onClick={() => {
              bookmarked
                ? bookmarkHandlers.remove(bookmarks.indexOf(scout.gacha_id))
                : bookmarkHandlers.append(scout.gacha_id);
            }}
            size={bookmarked ? 32 : 26}
          >
            <IconBookmark
              strokeWidth={2}
              color={bookmarked ? theme.colors[theme.primaryColor][0] : "white"}
              fill={
                bookmarked
                  ? theme.colors[theme.primaryColor][4]
                  : `${theme.colors.gray[5]}99`
              }
              style={{ filter: "drop-shadow(0px 0px 1px rgb(0 0 0))" }}
              size={
                !isMobile
                  ? bookmarked
                    ? 32
                    : 26
                  : isMobile && bookmarked
                  ? 44
                  : 40
              }
            />
          </ActionIcon>
        </Tooltip>
      )}
      <Card.Section
        component={Link}
        href={`/scouts/${scout.gacha_id}`}
        sx={{ position: "relative", top: 0 }}
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
