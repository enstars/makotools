import {
  ActionIcon,
  Button,
  Container,
  createStyles,
  Grid,
  Title,
} from "@mantine/core";
import { getMonthsNames } from "@mantine/dates";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons";
import { useEffect, useState } from "react";

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

function CalendarHeader({ ...props }) {
  const { classes } = useStyles();
  const [isMobile, setMobile] = useState<boolean>(true);

  useEffect(() => {
    window.innerWidth < 900 ? setMobile(true) : setMobile(false);
  }, []);

  const months = getMonthsNames(props.lang, "MMMM");

  let prevMonth =
    months.indexOf(props.month) !== 0
      ? months[months.indexOf(props.month) - 1]
      : months[11];

  let nextMonth =
    months.indexOf(props.month) !== 11
      ? months[months.indexOf(props.month) + 1]
      : months[0];

  let prevYear =
    months.indexOf(props.month) === 0 ? parseInt(props.year) - 1 : props.year;
  let nextYear =
    months.indexOf(props.month) === 11 ? parseInt(props.year) + 1 : props.year;

  return (
    <Container className={classes.headerContainer}>
      <Grid grow={isMobile} className={classes.header}>
        <Grid.Col span={2}>
          {!isMobile ? (
            <Button
              className={classes.nav}
              leftIcon={<IconArrowLeft size={32} />}
              onClick={(e: any) => {
                props.changeMonth(prevMonth);
                props.changeYear(prevYear);
              }}
            >
              {prevMonth.substring(0, 3)} {prevYear}
            </Button>
          ) : (
            <ActionIcon
              onClick={(e: any) => {
                props.changeMonth(prevMonth);
                props.changeYear(prevYear);
              }}
              color="blue"
            >
              <IconArrowLeft size={32} />
            </ActionIcon>
          )}
        </Grid.Col>
        <Grid.Col span={8} className={classes.calTitle}>
          <Title order={2}>
            {props.month} {props.year}
          </Title>
        </Grid.Col>
        <Grid.Col span={2}>
          {!isMobile ? (
            <Button
              className={classes.nav}
              rightIcon={<IconArrowRight size={32} />}
              onClick={(e: any) => {
                props.changeMonth(nextMonth);
                props.changeYear(nextYear);
              }}
            >
              {nextMonth.substring(0, 3)} {nextYear}
            </Button>
          ) : (
            <ActionIcon
              onClick={(e: any) => {
                props.changeMonth(nextMonth);
                props.changeYear(nextYear);
              }}
              color="blue"
            >
              <IconArrowRight size={32} />
            </ActionIcon>
          )}
        </Grid.Col>
      </Grid>
    </Container>
  );
}

export default CalendarHeader;
