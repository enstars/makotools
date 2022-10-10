import { Button, createStyles, Grid, Title } from "@mantine/core";
import { getMonthsNames } from "@mantine/dates";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons";

const useStyles = createStyles((theme, _params, getRef) => ({
  header: {
    maxWidth: "100%",
    flexFlow: "row nowrap",
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
    width: "100%",
    background:
      theme.colorScheme === "dark"
        ? theme.colors.blue[7]
        : theme.colors.blue[4],
  },
}));

function CalendarHeader({ ...props }) {
  const { classes } = useStyles();
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
    <Grid grow columns={7} className={classes.header}>
      <Grid.Col span={1}>
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
      </Grid.Col>
      <Grid.Col span={5} className={classes.calTitle}>
        <Title order={2}>
          {props.month} {props.year}
        </Title>
      </Grid.Col>
      <Grid.Col span={1}>
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
      </Grid.Col>
    </Grid>
  );
}

export default CalendarHeader;
