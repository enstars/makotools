import {
  Box,
  Button,
  createStyles,
  MediaQuery,
  Stack,
  Title,
} from "@mantine/core";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import useTranslation from "next-translate/useTranslation";
import { ReactElement, useCallback } from "react";

import { useDayjs } from "services/libraries/dayjs";

const useStyles = createStyles((theme, _params, getRef) => ({
  header: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
    gap: theme.spacing.md,
  },
  centerSection: {
    textAlign: "center",
    flex: "1 1 0",
  },
}));

function CalendarHeader({
  calendarTime,
  setCalendarTime,
  children,
}: {
  calendarTime: string;
  setCalendarTime: (a: string) => void;
  children?: ReactElement;
}) {
  const { t } = useTranslation("calendar");
  const { classes } = useStyles();
  const { dayjs } = useDayjs();

  const shiftCalendarTime = useCallback(
    (months: number) => {
      setCalendarTime(dayjs(calendarTime).add(months, "month").format());
    },
    [setCalendarTime, calendarTime, dayjs]
  );

  return (
    <Box className={classes.header}>
      <Button onClick={() => shiftCalendarTime(-1)} px="xs" variant="subtle">
        <IconArrowLeft size={20} />
        <MediaQuery
          smallerThan="md"
          styles={{
            display: "none",
          }}
        >
          <Box ml={4}>
            {dayjs(calendarTime).add(-1, "month").format("MMM YYYY")}
          </Box>
        </MediaQuery>
      </Button>
      <Stack className={classes.centerSection} spacing={0} align="start">
        <Title order={2} my={0} color="dimmed" size="lg">
          {t("calendarHeader")}
        </Title>
        <Title order={3}>{dayjs(calendarTime).format("MMMM YYYY")}</Title>
      </Stack>

      {children}

      <Button onClick={() => shiftCalendarTime(1)} px="xs" variant="subtle">
        <MediaQuery
          smallerThan="md"
          styles={{
            display: "none",
          }}
        >
          <Box mr={4}>
            {dayjs(calendarTime).add(1, "month").format("MMM YYYY")}
          </Box>
        </MediaQuery>
        <IconArrowRight size={20} />
      </Button>
    </Box>
  );
}

export default CalendarHeader;
