import {
  ActionIcon,
  Chip,
  Group,
  Input,
  MultiSelect,
  Select,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import {
  IconArrowsSort,
  IconComet,
  IconDiamond,
  IconSortAscending,
  IconSortDescending,
} from "@tabler/icons-react";
import { useMemo } from "react";
import { useLocalStorage } from "@mantine/hooks";
import useTranslation from "next-translate/useTranslation";

import ScoutCard from "./components/ScoutCard";

import { getLayout } from "components/Layout";
import PageTitle from "components/sections/PageTitle";
import { getLocalizedDataArray } from "services/data";
import getServerSideUser from "services/firebase/getServerSideUser";
import { GameCard, GameCharacter, GameRegion, Scout } from "types/game";
import { QuerySuccess } from "types/makotools";
import { useDayjs } from "services/libraries/dayjs";
import useFSSList from "services/makotools/search";
import ResponsiveGrid from "components/core/ResponsiveGrid";
import useUser from "services/firebase/user";
import SearchOptions from "components/core/SearchOptions";
import { gameRegions } from "pages/settings/content/Region";
import { SelectItemForwardRef } from "pages/settings/shared/SelectSetting";

const defaultView = {
  filters: {
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
  scoutsQuery,
  cardsQuery,
  charactersQuery,
}: {
  scoutsQuery: QuerySuccess<Scout[]>;
  cardsQuery: QuerySuccess<GameCard[]>;
  charactersQuery: QuerySuccess<GameCharacter[]>;
}) {
  const { t } = useTranslation("scouts");
  const user = useUser();
  const { dayjs } = useDayjs();
  const theme = useMantineTheme();

  const scouts: Scout[] = useMemo(() => scoutsQuery.data, [scoutsQuery.data]);
  const cards: GameCard[] = useMemo(() => cardsQuery.data, [cardsQuery.data]);
  const characters = useMemo(
    () => charactersQuery.data,
    [charactersQuery.data]
  );

  const fssOptions = useMemo<FSSOptions<Scout, typeof defaultView.filters>>(
    () => ({
      filters: [
        {
          type: "characters",
          values: [],
          function: (view) => {
            return (scout) =>
              view.filters.characters.filter((value: number) => {
                return cards
                  .filter((card) => scout.cards?.includes(card.id))
                  .map((card) => card.character_id)
                  .includes(value);
              }).length > 0;
          },
        },
        {
          type: "types",
          values: [],
          function: (view) => {
            return (scout) =>
              view.filters.types.includes(scout.type) ||
              view.filters.types.length === 0;
          },
        },
      ],
      sorts: [
        {
          label: t("scoutId"),
          value: "id",
          function: (a: Scout, b: Scout) => a.gacha_id - b.gacha_id,
        },
        {
          label: t("startDate"),
          value: "date",
          function: (a: Scout, b: Scout) =>
            dayjs(a.start.en).unix() - dayjs(b.start.en).unix(),
        },
      ],
      baseSort: "id",
      search: {
        fields: ["name.0", "name.1", "name.2"],
      },
      defaultView,
    }),
    [cards, dayjs, t]
  );
  const { results, view, setView } = useFSSList<
    Scout,
    typeof defaultView.filters
  >(scouts, fssOptions);

  const [viewOptions, setViewOptions] = useLocalStorage({
    key: "viewOptions__scout",
    defaultValue: {
      region:
        (user.loggedIn && user.db?.setting__game_region) ||
        ("en" as GameRegion),
      // density: "full" as "full" | "compact",
    },
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
              label={t("common:search.charLabel")}
              placeholder={t("common:search.charPlaceholder")}
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
            <Input.Wrapper id="type" label="Scout Type">
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
                  {
                    value: "scout",
                    label: (
                      <Group
                        align="center"
                        spacing={6}
                        sx={{ display: "inline-flex" }}
                      >
                        <IconDiamond size={16} />
                        {t("campaigns:full.scout.scout")}
                      </Group>
                    ),
                  },
                  {
                    value: "feature scout",
                    label: (
                      <Group
                        align="center"
                        spacing={6}
                        sx={{ display: "inline-flex" }}
                      >
                        <IconComet size={16} />
                        {t("campaigns:full.scout.feature")}
                      </Group>
                    ),
                  },
                ].map((r) => (
                  <Chip
                    key={r.value}
                    value={r.value}
                    radius="md"
                    styles={{
                      label: {
                        paddingLeft: 10,
                        paddingRight: 10,
                      },
                      iconWrapper: {
                        verticalAlign: 2,
                      },
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
              withinPortal
            />
          </Group>
        }
      />
      <ResponsiveGrid width={200}>
        {results.map((scout) => (
          <ScoutCard
            key={scout.gacha_id}
            scout={scout}
            region={viewOptions.region}
          />
        ))}
      </ResponsiveGrid>
    </>
  );
}

export const getServerSideProps = getServerSideUser(async ({ locale }) => {
  const getScouts: any = await getLocalizedDataArray<Scout>(
    "scouts",
    locale,
    "gacha_id"
  );

  const cardsQuery: any = await getLocalizedDataArray<GameCard>(
    "cards",
    locale,
    "id",
    ["id", "character_id", "rarity"]
  );

  const getCharacters: any = await getLocalizedDataArray<GameCharacter>(
    "characters",
    locale,
    "character_id",
    ["character_id", "first_name", "sort_id"]
  );

  return {
    props: {
      scoutsQuery: getScouts,
      cardsQuery: cardsQuery,
      charactersQuery: getCharacters,
    },
  };
});

Page.getLayout = getLayout({ wide: true, hideOverflow: false });
export default Page;
