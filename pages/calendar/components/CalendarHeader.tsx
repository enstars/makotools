import {
  ActionIcon,
  Button,
  Container,
  createStyles,
  Grid,
  Title,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons";
import { useCallback } from "react";

import { useDayjs } from "services/libraries/dayjs";

const useStyles = createStyles((theme, _params, getRef) => ({
  headerContainer: {
    width: "100%",

    [`@media (max-width: ${theme.breakpoints.md}px)`]: {
      padding: 0,
    },
  },
  header: {
    width: "100%",
    margin: "auto",
    marginBottom: "2vh",
    padding: "2vh 0vw",
  },
  calTitle: {
    textAlign: "center",
  },
  nav: {
    display: "inline",
    height: "40px",
    background:
      theme.colorScheme === "dark"
        ? theme.colors.blue[7]
        : theme.colors.blue[4],
  },
}));

function CalendarHeader({
  calendarTime,
  setCalendarTime,
}: {
  calendarTime: string;
  setCalendarTime: (a: string) => void;
}) {
  const { classes } = useStyles();
  const isMobile = useMediaQuery("(max-width: 900px)");
  const { dayjs } = useDayjs();

  const shiftCalendarTime = useCallback(
    (months: number) => {
      setCalendarTime(dayjs(calendarTime).add(months, "month").format());
    },
    [setCalendarTime, calendarTime, dayjs]
  );

  return (
    <Container className={classes.headerContainer}>
      <Grid grow={isMobile} className={classes.header}>
        <Grid.Col span={2}>
          {!isMobile ? (
            <Button
              className={classes.nav}
              leftIcon={<IconArrowLeft size={32} />}
              onClick={() => shiftCalendarTime(-1)}
            >
              {dayjs(calendarTime).add(-1, "month").format("MMM YYYY")}
            </Button>
          ) : (
            <ActionIcon onClick={() => shiftCalendarTime(-1)} color="blue">
              <IconArrowLeft size={32} />
            </ActionIcon>
          )}
        </Grid.Col>
        <Grid.Col span={8} className={classes.calTitle}>
          <Title order={2}>{dayjs(calendarTime).format("MMMM YYYY")}</Title>
        </Grid.Col>
        <Grid.Col span={2}>
          {!isMobile ? (
            <Button
              className={classes.nav}
              rightIcon={<IconArrowRight size={32} />}
              onClick={() => shiftCalendarTime(1)}
            >
              {dayjs(calendarTime).add(1, "month").format("MMM YYYY")}
            </Button>
          ) : (
            <ActionIcon onClick={() => shiftCalendarTime(1)} color="blue">
              <IconArrowRight size={32} />
            </ActionIcon>
          )}
        </Grid.Col>
      </Grid>
    </Container>
  );
}

export default CalendarHeader;
