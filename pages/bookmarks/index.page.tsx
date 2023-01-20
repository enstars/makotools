import { useEffect, useMemo, useState } from "react";
import {
  ActionIcon,
  Badge,
  Box,
  Card,
  Chip,
  Group,
  Input,
  Paper,
  Select,
  Stack,
  Text,
  TextInput,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import Link from "next/link";
import {
  IconArrowsSort,
  IconCalendarDue,
  IconSearch,
  IconSortAscending,
  IconSortDescending,
} from "@tabler/icons";
import {
  useDebouncedValue,
  useLocalStorage,
  useMediaQuery,
} from "@mantine/hooks";
import fuzzysort from "fuzzysort";

import { getLayout } from "components/Layout";
import { getLocalizedDataArray } from "services/data";
import getServerSideUser from "services/firebase/getServerSideUser";
import { Event, EventType, ID, Scout, ScoutType } from "types/game";
import { QuerySuccess, UserLoggedIn } from "types/makotools";
import PageTitle from "components/sections/PageTitle";
import useUser from "services/firebase/user";
import ResponsiveGrid from "components/core/ResponsiveGrid";
import Picture from "components/core/Picture";
import { useDayjs } from "services/libraries/dayjs";
import { countdown } from "services/campaigns";

type SortOption = "alpha" | "type" | "date";

function BookmarkedCard({ campaign }: { campaign: Event | Scout }) {
  const { dayjs } = useDayjs();
  const theme = useMantineTheme();
  const [countdownAmt, setCountdownAmt] = useState<string>();
  const isMobile = useMediaQuery("(max-width: 768px)");
  useEffect(() => {
    if (dayjs(campaign.end.en).isBefore(dayjs())) {
      setCountdownAmt("PAST");
    } else if (
      dayjs().isBetween(dayjs(campaign.start.en), dayjs(campaign.end.en))
    ) {
      setCountdownAmt("ONGOING");
    } else {
      let ctdwn = countdown(new Date(campaign.start.en), new Date());
      const d = Math.floor(ctdwn / 86400000);
      const h = Math.floor((ctdwn % 86400000) / 3600000);
      const m = Math.floor(((ctdwn % 86400000) % 3600000) / 60000);
      const s = Math.floor((((ctdwn % 86400000) % 3600000) % 60000) / 1000);
      setCountdownAmt(
        d === 0 && h === 0 && m === 0
          ? `${s} secs`
          : d === 0 && h === 0
          ? `${m} mins`
          : d === 0
          ? `${h} hrs`
          : `${d} days`
      );
    }
  }, [campaign.start.en]);

  return (
    <Card
      withBorder
      p={0}
      mb={5}
      component={Link}
      href={`/${
        campaign.type === "scout" || campaign.type === "feature scout"
          ? "scouts"
          : "events"
      }/${
        campaign.type === "scout" || campaign.type == "feature scout"
          ? campaign.gacha_id
          : campaign.event_id
      }`}
      sx={{ position: "relative" }}
    >
      <Group noWrap>
        <Picture
          alt={campaign.name[0]}
          srcB2={`assets/card_still_full1_${campaign.banner_id}_evolution.webp`}
          sx={{ width: isMobile ? 150 : 250, height: 120 }}
        />
        <Stack spacing={5} sx={{ width: isMobile ? 150 : 350 }}>
          <Group>
            <Badge
              variant="filled"
              color={
                campaign.type === "scout"
                  ? "grape"
                  : campaign.type === "feature scout"
                  ? "blue"
                  : campaign.type === "tour"
                  ? "yellow"
                  : campaign.type === "shuffle"
                  ? "teal"
                  : "green"
              }
            >
              {campaign.type}
            </Badge>
            <Badge leftSection={<IconCalendarDue size={14} />}>
              {countdownAmt}
            </Badge>
          </Group>

          <Text weight={700} lineClamp={isMobile ? 1 : 2}>
            {campaign.name[0]}
          </Text>
          <Text>
            Starts on{" "}
            <Text
              weight={700}
              component="span"
              sx={{
                background: `${theme.colors.yellow[4]}55`,
                padding: "2px 5px",
                borderRadius: 10,
              }}
            >
              {dayjs(campaign.start.en).format("MM/DD/YYYY")}
            </Text>
          </Text>
        </Stack>
      </Group>
    </Card>
  );
}

function Page({
  eventsQuery,
  scoutsQuery,
}: {
  eventsQuery: QuerySuccess<Event[]>;
  scoutsQuery: QuerySuccess<Scout[]>;
}) {
  const theme = useMantineTheme();
  const user = useUser();

  const events: Event[] = useMemo(() => eventsQuery.data, [eventsQuery.data]);
  const scouts: Scout[] = useMemo(() => scoutsQuery.data, [scoutsQuery.data]);

  const bookmarkedEvents: ID[] =
    (user as UserLoggedIn).db.bookmarks__events || [];
  const bookmarkedScouts: ID[] =
    (user as UserLoggedIn).db.bookmarks__scouts || [];

  const filteredEvents = events.filter((ev) =>
    bookmarkedEvents.includes(ev.event_id)
  );
  const filteredScouts = scouts.filter((sc) =>
    bookmarkedScouts.includes(sc.gacha_id)
  );

  const bookmarkedCampaigns = [...filteredEvents, ...filteredScouts];

  const isMobile = useMediaQuery("(max-width: 768px)");

  interface BookmarkViewOptions {
    filterType: (EventType | ScoutType)[];
    searchQuery: string;
    sortOption: SortOption;
    sortDescending: boolean;
  }

  const VIEW_OPTIONS_DEFAULT: BookmarkViewOptions = {
    filterType: [],
    searchQuery: "",
    sortOption: "date",
    sortDescending: false,
  };

  const [viewOptions, setViewOptions] = useLocalStorage<BookmarkViewOptions>({
    key: "bookmarkFilters",
    defaultValue: VIEW_OPTIONS_DEFAULT,
  });

  const SORT_OPTIONS: { value: SortOption; label: string }[] = [
    { value: "alpha", label: "Alphabetical" },
    { value: "type", label: "Campaign type" },
    { value: "date", label: "Start date" },
  ];

  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 200);

  const descendingNum = viewOptions.sortDescending ? -1 : 1;

  const SORT_FUNCTIONS = {
    alpha: (a: any, b: any) => {
      return a.name[0].localeCompare(b.name[0]) * descendingNum;
    },
    type: (a: any, b: any) => a.type.localeCompare(b.type) * descendingNum,
    date: (a: any, b: any) =>
      (new Date(a.start.en).getTime() - new Date(b.start.en).getTime()) *
      descendingNum,
  };

  const [bookmarksList, setBookmarksList] = useState<(Event | Scout)[]>([]);

  useEffect(() => {
    let filteredBookmarks: (Event | Scout)[] = bookmarkedCampaigns.filter(
      (b) => {
        return viewOptions.filterType.length
          ? viewOptions.filterType.includes(b.type)
          : true;
      }
    );

    const searchedList = fuzzysort.go(debouncedSearch, filteredBookmarks, {
      keys: ["name.0", "name.1", "name.2"],
      all: true,
    });

    const sortedBookmarks = [...searchedList]
      .sort((a: any, b: any) => b.score - a.score)
      .map((bm) => bm.obj)
      .sort(SORT_FUNCTIONS[viewOptions.sortOption]);

    setBookmarksList(sortedBookmarks);
  }, [viewOptions, debouncedSearch]);

  return (
    <>
      <PageTitle title="Bookmarks" />
      <Box>
        <Paper withBorder mb={20} p="md">
          <Text weight={700} size="xs">
            Filter options
          </Text>
          <Group align="flex-start">
            <TextInput
              label="Search"
              placeholder="Type a campaign name..."
              sx={{ maxWidth: 220 }}
              variant="default"
              icon={<IconSearch size="1em" />}
              onChange={(ev) => {
                setSearch(ev.target.value);
              }}
            />
            <Select
              label="Sort by"
              data={SORT_OPTIONS}
              value={viewOptions.sortOption}
              icon={<IconArrowsSort size="1em" />}
              onChange={(val: SortOption) => {
                if (val) setViewOptions({ ...viewOptions, sortOption: val });
              }}
              rightSection={
                <Tooltip label="Toggle ascending/descending">
                  <ActionIcon
                    onClick={() => {
                      setViewOptions((v) => ({
                        ...viewOptions,
                        sortDescending: !v.sortDescending,
                      }));
                    }}
                    variant="light"
                    color={theme.primaryColor}
                  >
                    {viewOptions.sortDescending ? (
                      <IconSortAscending size={16} />
                    ) : (
                      <IconSortDescending size={16} />
                    )}
                  </ActionIcon>
                </Tooltip>
              }
            />
            <Input.Wrapper label="Campaign type">
              <Chip.Group
                multiple
                spacing={3}
                onChange={(val: (EventType | ScoutType)[]) => {
                  setViewOptions({ ...viewOptions, filterType: val });
                }}
              >
                {["song", "tour", "scout", "feature scout", "shuffle"].map(
                  (type) => (
                    <Chip
                      key={type}
                      value={type}
                      radius="md"
                      color="yellow"
                      variant="filled"
                      styles={{
                        label: {
                          paddingLeft: 10,
                          paddingRight: 10,
                          textTransform: "uppercase",
                          fontWeight: 600,
                        },
                        iconWrapper: { display: "none" },
                      }}
                    >
                      {type}
                    </Chip>
                  )
                )}
              </Chip.Group>
            </Input.Wrapper>
          </Group>
        </Paper>
        <ResponsiveGrid width={isMobile ? 300 : 500}>
          {bookmarksList.map((bm: Event | Scout, i: number) => {
            return <BookmarkedCard key={i} campaign={bm} />;
          })}
        </ResponsiveGrid>
      </Box>
    </>
  );
}

export const getServerSideProps = getServerSideUser(async ({ locale }) => {
  const eventsQuery: any = await getLocalizedDataArray<Event>(
    "events",
    locale,
    "event_id"
  );

  const scoutsQuery: any = await getLocalizedDataArray<Scout>(
    "scouts",
    locale,
    "gacha_id"
  );

  return {
    props: {
      eventsQuery: eventsQuery,
      scoutsQuery: scoutsQuery,
    },
  };
});

Page.getLayout = getLayout({ wide: true });
export default Page;
