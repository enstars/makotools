import { useEffect, useMemo, useState } from "react";
import {
  ActionIcon,
  Anchor,
  Badge,
  Box,
  Card,
  Center,
  Chip,
  Group,
  Input,
  Select,
  Stack,
  Text,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import Link from "next/link";
import {
  IconArrowsSort,
  IconSortAscending,
  IconSortDescending,
} from "@tabler/icons-react";
import { useLocalStorage, useMediaQuery } from "@mantine/hooks";
import useTranslation from "next-translate/useTranslation";
import Trans from "next-translate/Trans";

import { getLayout } from "components/Layout";
import { getLocalizedDataArray } from "services/data";
import getServerSideUser from "services/firebase/getServerSideUser";
import { Event, GameRegion, ID, Scout } from "types/game";
import { QuerySuccess } from "types/makotools";
import PageTitle from "components/sections/PageTitle";
import useUser from "services/firebase/user";
import ResponsiveGrid from "components/core/ResponsiveGrid";
import Picture from "components/core/Picture";
import { useDayjs } from "services/libraries/dayjs";
import { countdown } from "services/campaigns";
import useFSSList from "services/makotools/search";
import SearchOptions from "components/core/SearchOptions";
import { gameRegions } from "pages/settings/content/Region";
import { SelectItemForwardRef } from "pages/settings/shared/SelectSetting";

type SortOption = "alpha" | "type" | "date";

function BookmarkedCard({
  campaign,
  region,
}: {
  campaign: Event | Scout;
  region: GameRegion;
}) {
  const { dayjs } = useDayjs();
  const { t } = useTranslation("bookmarks__page");
  const theme = useMantineTheme();
  const [countdownAmt, setCountdownAmt] = useState<string>();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const startDate = useMemo(
    () => campaign.start[region] || 0,
    [campaign, dayjs, region]
  );
  const endDate = useMemo(
    () => campaign.end[region] || 0,
    [campaign, dayjs, region]
  );
  const datesUnknown = useMemo(
    () => startDate === 0 || endDate === 0,
    [startDate, endDate]
  );

  useEffect(() => {
    if (datesUnknown) {
      setCountdownAmt(t("countdown.unknown"));
    } else if (dayjs(endDate).isBefore(dayjs())) {
      setCountdownAmt(t("countdown.ended"));
    } else if (dayjs().isBetween(dayjs(startDate), dayjs(endDate))) {
      setCountdownAmt(
        t("countdown.ongoing", {
          end: dayjs(endDate).format("ll"),
        })
      );
    } else {
      let ctdwn = countdown(new Date(startDate), new Date());
      const d = Math.floor(ctdwn / 86400000);
      const h = Math.floor((ctdwn % 86400000) / 3600000);

      if (d > 0) {
        setCountdownAmt(
          t("countdown.upcomingDays", {
            count: d,
          })
        );
      } else {
        setCountdownAmt(
          t("countdown.upcomingHours", {
            count: h,
          })
        );
      }
    }
  }, [startDate, endDate, dayjs, t, datesUnknown]);

  return (
    <Card withBorder sx={{ position: "relative" }} p="md">
      <Card.Section>
        <Picture
          alt={campaign.name[0]}
          srcB2={`assets/card_still_full1_${campaign.banner_id}_evolution.webp`}
          sx={{ width: "100%", height: 120 }}
        >
          <Center
            sx={{
              zIndex: 10,
              position: "absolute",
              width: "100%",
              textAlign: "center",
              bottom: 0,
              background: "linear-gradient(to top, #000C, #0000)",
              height: "75%",
              alignItems: "flex-end",
            }}
          >
            <Stack spacing={2} mb="xs" align="center">
              <Badge
                variant="filled"
                size="sm"
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
                {campaign.type === "scout" || campaign.type === "feature scout"
                  ? t(`campaigns:short.scout.${campaign.type}`)
                  : t(`campaigns:short.event.${campaign.type}`)}
              </Badge>
              <Text
                sx={(theme) => ({
                  fontFamily: theme.headings.fontFamily,
                })}
                weight={900}
                size="lg"
              >
                {countdownAmt}
              </Text>
            </Stack>
          </Center>
        </Picture>
      </Card.Section>
      <Stack spacing={5} pt="sm">
        <Anchor
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
          weight={700}
        >
          {campaign.name[0]}
        </Anchor>
        <Text size="sm" color="dimmed" weight={500}>
          {datesUnknown ? (
            t("campaignStartsUnknown")
          ) : (
            <Trans
              i18nKey="bookmarks__page:campaignStarts"
              components={[<Text weight={700} key={0} />]}
              values={{
                date: dayjs(startDate || 0).format("ll"),
              }}
            />
          )}
        </Text>
      </Stack>
    </Card>
  );
}

const defaultView = {
  filters: {
    types: [] as string[],
  },
  search: "",
  sort: {
    type: "date",
    ascending: true,
  },
};

function Page({
  eventsQuery,
  scoutsQuery,
}: {
  eventsQuery: QuerySuccess<Event[]>;
  scoutsQuery: QuerySuccess<Scout[]>;
}) {
  const { dayjs } = useDayjs();
  const { t } = useTranslation("bookmarks__page");
  const theme = useMantineTheme();
  const user = useUser();

  const events: Event[] = useMemo(() => eventsQuery.data, [eventsQuery.data]);
  const scouts: Scout[] = useMemo(() => scoutsQuery.data, [scoutsQuery.data]);

  const bookmarkedEvents: ID[] = user.loggedIn
    ? user.db.bookmarks__events || []
    : [];
  const bookmarkedScouts: ID[] = user.loggedIn
    ? user.db.bookmarks__scouts || []
    : [];

  const filteredEvents = events.filter((ev) =>
    bookmarkedEvents.includes(ev.event_id)
  );
  const filteredScouts = scouts.filter((sc) =>
    bookmarkedScouts.includes(sc.gacha_id)
  );

  const bookmarkedCampaigns = [...filteredEvents, ...filteredScouts];

  const [viewOptions, setViewOptions] = useLocalStorage({
    key: "bookmarkFilters",
    defaultValue: {
      region: (user.loggedIn && user.db.setting__game_region) || "en",
    },
  });

  const fssOptions = useMemo<
    FSSOptions<Event<string[]> | Scout<string[]>, typeof defaultView.filters>
  >(
    () => ({
      filters: [
        // {
        //   type: "units",
        //   values: [],
        //   function: (view) => {
        //     return (c: Event) =>
        //       view.filters.units.filter((value) => c.unit_id?.includes(value))
        //         .length === view.filters.units.length;
        //   },
        // },
        // {
        //   type: "characters",
        //   values: [],
        //   function: (view) => {
        //     return (c: Event) =>
        //       view.filters.characters.filter((value: number) => {
        //         return cards
        //           .filter((card) => c.cards?.includes(card.id))
        //           .map((card) => card.character_id)
        //           .includes(value);
        //       }).length > 0;
        //   },
        // },
        {
          type: "types",
          values: [],
          function: (view) => {
            return (c) => view.filters.types.includes(c.type);
          },
        },
      ],
      sorts: [
        {
          label: t("search.sortByID"),
          value: "id",
          function: (a, b) => {
            // events go before scouts
            const aIsScout = a.type === "scout" || a.type === "feature scout";
            const bIsScout = b.type === "scout" || b.type === "feature scout";
            if (aIsScout && !bIsScout) return 1;
            if (!aIsScout && bIsScout) return -1;
            if (aIsScout && bIsScout) return a.gacha_id - b.gacha_id;
            return (a as Event).event_id - (b as Event).event_id;
          },
        },
        {
          label: t("search.sortByAlphabetical"),
          value: "alphabetical",
          function: (a: Event, b: Event) => {
            return a.name[0].localeCompare(b.name[0]);
          },
        },
        {
          label: t("search.sortByEventDate"),
          value: "date",
          function: (a: Event, b: Event) =>
            dayjs(a.start[viewOptions.region] || 0).unix() -
            dayjs(b.start[viewOptions.region] || 0).unix(),
        },
      ],
      baseSort: "id",
      search: {
        fields: ["name.0", "name.1", "name.2"],
      },
      defaultView,
    }),
    [t, dayjs]
  );

  const { results, view, setView } = useFSSList<
    Event<string[]> | Scout<string[]>,
    typeof defaultView.filters
  >(bookmarkedCampaigns, fssOptions);

  const hasBookmarks = bookmarkedCampaigns.length > 0;
  return (
    <>
      <PageTitle title="Bookmarks" />
      {hasBookmarks ? (
        <>
          <SearchOptions
            searchProps={{
              placeholder: t("search.searchPlaceholder"),
              value: view.search,
              onChange: (event) => {
                setView((v) => ({
                  ...v,
                  search: event.target.value,
                }));
              },
              width: "100%",
            }}
            filters={
              <Group>
                <Select
                  label={t("common:search.sortLabel")}
                  placeholder={t("common:search.sortPlaceholder")}
                  // data={fssOptions.sorts}
                  // value={view.sort.type}
                  onChange={(value) => {
                    if (value)
                      setView((v) => ({
                        ...v,
                        sort: {
                          ...v.sort,
                          type: value,
                        },
                      }));
                  }}
                  sx={{ maxWidth: 200 }}
                  variant="default"
                  icon={<IconArrowsSort size="1em" />}
                  {...(view.search
                    ? {
                        disabled: true,
                        data: [
                          {
                            label: t("common:search.relevance"),
                            value: "relevance",
                          },
                        ],
                        value: "relevance",
                        rightSection: undefined,
                      }
                    : {
                        disabled: false,
                        data: fssOptions.sorts,
                        value: view.sort.type,
                        rightSection: (
                          <Tooltip label="Toggle ascending/descending">
                            <ActionIcon
                              onClick={() => {
                                setView((v) => ({
                                  ...v,
                                  sort: {
                                    ...v.sort,
                                    ascending: !v.sort.ascending,
                                  },
                                }));
                              }}
                              variant="light"
                              color={theme.primaryColor}
                            >
                              {view.sort.ascending ? (
                                <IconSortAscending size={16} />
                              ) : (
                                <IconSortDescending size={16} />
                              )}
                            </ActionIcon>
                          </Tooltip>
                        ),
                      })}
                />
                <Input.Wrapper id="type" label="Event Type">
                  <Chip.Group
                    multiple
                    value={view.filters.types}
                    onChange={(val) => {
                      setView((v) => ({
                        ...v,
                        filters: {
                          ...v.filters,
                          types: val,
                        },
                      }));
                    }}
                    spacing={3}
                  >
                    {[
                      { value: "song", label: t("campaigns:full.event.song") },
                      { value: "tour", label: t("campaigns:full.event.tour") },
                      {
                        value: "shuffle",
                        label: t("campaigns:full.event.shuffle"),
                      },
                      {
                        value: "scout",
                        label: t("campaigns:full.scout.scout"),
                      },
                      {
                        value: "feature scout",
                        label: t("campaigns:full.scout.feature"),
                      },
                    ].map((r) => (
                      <Chip
                        key={r.value}
                        value={r.value}
                        radius="md"
                        styles={{
                          label: { paddingLeft: 10, paddingRight: 10 },
                        }}
                        variant="filled"
                      >
                        {r.label}
                      </Chip>
                    ))}
                  </Chip.Group>
                </Input.Wrapper>
              </Group>
            }
            resetFilters={() => {
              setView(defaultView);
            }}
            display={
              <Group align="flex-start">
                <Select
                  label={t("common:search.regionForDates")}
                  description={t("common:search.regionForDatesDesc")}
                  data={gameRegions.map((r) => ({
                    value: r.value,
                    label: t(`regions:region.${r.value}`),
                    icon: r.icon,
                  }))}
                  icon={
                    gameRegions.find((r) => r.value === viewOptions.region)
                      ?.icon
                  }
                  itemComponent={SelectItemForwardRef}
                  value={viewOptions.region}
                  onChange={(value) => {
                    setViewOptions((v) => ({
                      ...v,
                      region: value as GameRegion,
                    }));
                  }}
                  sx={{ maxWidth: 200 }}
                  variant="default"
                />
                {/* <Input.Wrapper label={t("common:search.density")}>
              <SegmentedControl
                sx={{ display: "flex" }}
                value={viewOptions.density}
                onChange={(value) => {
                  setViewOptions((v) => ({
                    ...v,
                    density: value as "full" | "compact",
                  }));
                }}
                data={[
                  {
                    value: "full",
                    label: (
                      <Center>
                        <IconLayoutList size={16} />
                        <Box ml={10}>{t("common:search.full")}</Box>
                      </Center>
                    ),
                  },
                  {
                    value: "compact",
                    label: (
                      <Center>
                        <IconList size={16} />
                        <Box ml={10}>{t("common:search.compact")}</Box>
                      </Center>
                    ),
                  },
                ]}
              />
            </Input.Wrapper> */}
              </Group>
            }
          />
          <Box>
            {results.length === 0 ? (
              <Center>
                <Text color="dimmed">{t("search.noMatch")}</Text>
              </Center>
            ) : (
              <ResponsiveGrid width={180}>
                {results.map((bm: Event | Scout, i: number) => {
                  return (
                    <BookmarkedCard
                      key={i}
                      campaign={bm}
                      region={viewOptions.region}
                    />
                  );
                })}
              </ResponsiveGrid>
            )}
          </Box>
        </>
      ) : (
        <Center>
          <Text color="dimmed">{t("search.noBookmarks")}</Text>
        </Center>
      )}
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
