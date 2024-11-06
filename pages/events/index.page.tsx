import {
  ActionIcon,
  Box,
  Center,
  Chip,
  Group,
  Input,
  MultiSelect,
  SegmentedControl,
  Select,
  Text,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import {
  IconArrowsSort,
  IconLayoutList,
  IconList,
  IconSortAscending,
  IconSortDescending,
} from "@tabler/icons-react";
import { useMemo } from "react";
import dayjs from "dayjs";
import { useLocalStorage } from "@mantine/hooks";
import useTranslation from "next-translate/useTranslation";

import EventCard from "./components/EventCard";

import { getLayout } from "components/Layout";
import PageTitle from "components/sections/PageTitle";
import { getLocalizedDataArray } from "services/data";
import getServerSideUser from "services/firebase/getServerSideUser";
import {
  GameCard,
  GameCharacter,
  Event,
  GameUnit,
  GameRegion,
} from "types/game";
import { QuerySuccess } from "types/makotools";
import useFSSList from "services/makotools/search";
import useUser from "services/firebase/user";
import SearchOptions from "components/core/SearchOptions";
import { gameRegions } from "pages/settings/content/Region";
import { SelectItemForwardRef } from "pages/settings/shared/SelectSetting";
import ResponsiveGrid from "components/core/ResponsiveGrid";

const defaultView = {
  filters: {
    units: [] as number[],
    characters: [] as number[],
    types: [] as string[],
  },
  search: "",
  sort: {
    type: "id",
    ascending: true,
  },
};

function Page({
  eventsQuery,
  cardsQuery,
  unitsQuery,
  charactersQuery,
}: {
  eventsQuery: QuerySuccess<Event[]>;
  cardsQuery: QuerySuccess<GameCard[]>;
  unitsQuery: QuerySuccess<GameUnit[]>;
  charactersQuery: QuerySuccess<GameCharacter[]>;
}) {
  const { t } = useTranslation("events");
  const { user, userDB } = useUser();
  const theme = useMantineTheme();
  const events = useMemo(() => eventsQuery.data, [eventsQuery.data]);
  const cards = useMemo(() => cardsQuery.data, [cardsQuery.data]);
  const units = useMemo(() => unitsQuery.data, [unitsQuery.data]);
  const characters = useMemo(
    () => charactersQuery.data,
    [charactersQuery.data]
  );

  const fssOptions = useMemo<FSSOptions<Event, typeof defaultView.filters>>(
    () => ({
      filters: [
        {
          type: "units",
          values: [],
          function: (view) => {
            return (c: Event) =>
              view.filters.units.filter((value) => c.unit_id?.includes(value))
                .length === view.filters.units.length;
          },
        },
        {
          type: "characters",
          values: [],
          function: (view) => {
            return (c: Event) =>
              view.filters.characters.filter((value: number) => {
                return cards
                  .filter((card) => c.cards?.includes(card.id))
                  .map((card) => card.character_id)
                  .includes(value);
              }).length > 0;
          },
        },
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
          label: t("search.sortByEventID"),
          value: "id",
          function: (a: Event, b: Event) => a.event_id - b.event_id,
        },
        {
          label: t("search.sortByEventDate"),
          value: "date",
          function: (a: Event, b: Event) =>
            dayjs(a.start.jp).unix() - dayjs(b.start.jp).unix(),
        },
      ],
      baseSort: "id",
      search: {
        fields: ["name.0", "name.1", "name.2"],
      },
      defaultView,
    }),
    [cards, t]
  );
  const { results, view, setView } = useFSSList<
    Event,
    typeof defaultView.filters
  >(events, fssOptions);

  const [viewOptions, setViewOptions] = useLocalStorage({
    key: "viewOptions__event",
    defaultValue: {
      region:
        (user.loggedIn && userDB?.setting__game_region) || ("en" as GameRegion),
      density: "full" as "full" | "compact",
    },
  });

  let characterIDtoSort: { [key: number]: number } = {};
  characters.forEach((c) => {
    characterIDtoSort[c.character_id] = c.sort_id;
  });

  return (
    <>
      <PageTitle title={t("title")} />
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
            <MultiSelect
              label={t("search.unitsLabel")}
              placeholder={t("search.unitsPlaceholder")}
              data={units
                .sort((a: GameUnit, b: GameUnit) => a.id - b.id)
                .map((unit) => {
                  return {
                    value: unit.id.toString(),
                    label: unit.name[0],
                  };
                })}
              variant="default"
              searchable
              onChange={(val) => {
                setView((v) => ({
                  ...v,
                  filters: {
                    ...v.filters,
                    units: val.map((u) => parseInt(u)),
                  },
                }));
              }}
              value={view.filters.units.map((u) => u.toString())}
            />
            <MultiSelect
              label={t("search.charLabel")}
              placeholder={t("search.charPlaceholder")}
              data={characters
                .sort((a, b) => a.sort_id - b.sort_id)
                .map((c: GameCharacter) => {
                  return {
                    value: c.character_id.toString(),
                    label: c.first_name[0],
                  };
                })}
              value={view.filters.characters.map((u) => u.toString())}
              onChange={(val) => {
                setView((v) => ({
                  ...v,
                  filters: {
                    ...v.filters,
                    characters: val.map((u) => parseInt(u)),
                  },
                }));
              }}
              sx={{ maxWidth: 400 }}
              variant="default"
              searchable
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
                gameRegions.find((r) => r.value === viewOptions.region)?.icon
              }
              itemComponent={SelectItemForwardRef}
              value={viewOptions.region}
              onChange={(value) => {
                setViewOptions((v) => ({ ...v, region: value as GameRegion }));
              }}
              sx={{ maxWidth: 200 }}
              variant="default"
            />
            <Input.Wrapper label={t("common:search.density")}>
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
            </Input.Wrapper>
          </Group>
        }
      />
      <ResponsiveGrid width={viewOptions.density === "full" ? "1fr" : 300}>
        {results.length > 0 ? (
          results.map((event) => (
            <EventCard
              key={event.event_id}
              event={event}
              units={units}
              region={viewOptions.region}
              density={viewOptions.density}
            />
          ))
        ) : (
          <Center>
            <Text color="dimmed">{t("search.noMatch")}</Text>
          </Center>
        )}
      </ResponsiveGrid>
    </>
  );
}

export const getServerSideProps = getServerSideUser(async ({ locale }) => {
  const eventsQuery: any = await getLocalizedDataArray<Event>(
    "events",
    locale,
    "event_id"
  );

  const cardsQuery: any = await getLocalizedDataArray<GameCard>(
    "cards",
    locale,
    "id",
    ["id", "character_id", "rarity"]
  );

  const charactersQuery: any = await getLocalizedDataArray<GameCharacter>(
    "characters",
    locale,
    "character_id",
    ["character_id", "first_name", "sort_id"]
  );

  const unitsQuery: any = await getLocalizedDataArray<GameUnit>(
    "units",
    locale,
    "id"
  );

  return {
    props: {
      eventsQuery,
      cardsQuery,
      unitsQuery,
      charactersQuery,
    },
  };
});

Page.getLayout = getLayout({ wide: true });
export default Page;
