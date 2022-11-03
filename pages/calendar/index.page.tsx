import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Center,
  createStyles,
  Divider,
  MediaQuery,
  SegmentedControl,
  Text,
} from "@mantine/core";
import { IconCalendar, IconList } from "@tabler/icons";

import { getLayout } from "../../components/Layout";
import getServerSideUser from "../../services/firebase/getServerSideUser";
import { useDayjs } from "../../services/libraries/dayjs";

import CalendarGridView from "./components/CalendarGridView";
import CalendarListView from "./components/CalendarListView";
import CalendarHeader from "./components/CalendarHeader";

import { getLocalizedDataArray } from "services/data";
import { createBirthdayData } from "services/events";
import {
  GameCharacter,
  GameEvent,
  ScoutEvent,
  BirthdayEvent,
} from "types/game";
import { QuerySuccess } from "types/makotools";

/**
 * If the user is viewing from a mobile phone, the default view should be the list view. Otherwise, it should be the traditional calendar.
 */

const useStyles = createStyles((theme, _params, getRef) => ({
  calendar: {
    maxWidth: "100%",
  },
}));

function Page({
  charactersQuery,
  gameEventsQuery,
  scoutsQuery,
}: {
  charactersQuery: QuerySuccess<GameCharacter[]>;
  gameEventsQuery: QuerySuccess<GameEvent[]>;
  scoutsQuery: QuerySuccess<ScoutEvent[]>;
}) {
  const { classes } = useStyles();
  const { dayjs } = useDayjs();

  const characters: GameCharacter[] = useMemo(
    () => charactersQuery.data,
    [charactersQuery.data]
  );
  const gameEvents: GameEvent[] = useMemo(
    () => gameEventsQuery.data,
    [gameEventsQuery.data]
  );
  const scouts: ScoutEvent[] = useMemo(
    () => scoutsQuery.data,
    [scoutsQuery.data]
  );

  const birthdays: BirthdayEvent[] = createBirthdayData(characters);

  const events = [...birthdays, ...gameEvents, ...scouts];

  const [calendarTime, setCalendarTime] = useState<string>(dayjs().format());

  const [view, setView] = useState<string>("cal");
  const [showViewOptions, changeShowViewOptions] = useState<boolean>(true);

  useEffect(() => {
    window.innerWidth < 900 ? setView("list") : setView("cal");
    window.innerWidth < 900
      ? changeShowViewOptions(false)
      : changeShowViewOptions(true);
  }, []);

  return (
    <>
      <MediaQuery
        largerThan="sm"
        styles={{
          display: "none",
        }}
      >
        <SegmentedControl
          fullWidth
          my="xs"
          value={view}
          onChange={setView}
          data={[
            {
              label: (
                <Center>
                  <IconCalendar size={16} />
                  <Text ml="xs">Monthly</Text>
                </Center>
              ),
              value: "cal",
            },
            {
              label: (
                <Center>
                  <IconList size={16} />
                  <Text ml="xs">Daily</Text>
                </Center>
              ),
              value: "list",
            },
          ]}
        />
      </MediaQuery>
      <Box className={classes.calendar}>
        <CalendarHeader
          calendarTime={calendarTime}
          setCalendarTime={setCalendarTime}
        >
          <MediaQuery
            smallerThan="sm"
            styles={{
              display: "none",
            }}
          >
            <SegmentedControl
              value={view}
              onChange={setView}
              data={[
                {
                  label: (
                    <Center>
                      <IconCalendar size={16} />
                      <Text ml="xs">Month</Text>
                    </Center>
                  ),
                  value: "cal",
                },
                {
                  label: (
                    <Center>
                      <IconList size={16} />
                      <Text ml="xs">Day</Text>
                    </Center>
                  ),
                  value: "list",
                },
              ]}
            />
          </MediaQuery>
        </CalendarHeader>
        <Divider py="xs" />
        {view === "cal" ? (
          <CalendarGridView events={events} calendarTime={calendarTime} />
        ) : (
          <CalendarListView events={events} calendarTime={calendarTime} />
        )}
        {view === "list" && (
          <CalendarHeader
            calendarTime={calendarTime}
            setCalendarTime={setCalendarTime}
          />
        )}
      </Box>
    </>
  );
}

export const getServerSideProps = getServerSideUser(async ({ res, locale }) => {
  const characters = await getLocalizedDataArray<GameCharacter>(
    "characters",
    locale,
    "character_id"
  );

  const gameEvents: any = await getLocalizedDataArray(
    "events",
    locale,
    "event_id"
  );

  const scouts = await getLocalizedDataArray<ScoutEvent>(
    "scouts",
    locale,
    "gacha_id"
  );

  return {
    props: {
      charactersQuery: characters,
      gameEventsQuery: gameEvents,
      scoutsQuery: scouts,
      locale: locale,
    },
  };
});
Page.getLayout = getLayout({ wide: true });
export default Page;
