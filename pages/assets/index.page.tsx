import {
  ActionIcon,
  Box,
  Card,
  Center,
  Chip,
  Group,
  Input,
  Loader,
  MultiSelect,
  Paper,
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
  IconStar,
} from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useListState, useLocalStorage } from "@mantine/hooks";
import useTranslation from "next-translate/useTranslation";
import InfiniteScroll from "react-infinite-scroll-component";
import Link from "next/link";

import { getLayout } from "components/Layout";
import PageTitle from "components/sections/PageTitle";
import { getLocalizedDataArray } from "services/data";
import getServerSideUser from "services/firebase/getServerSideUser";
import {
  GameCard,
  GameCharacter,
  GameUnit,
  GameRegion,
  GameCardOld,
  CardRarity,
} from "types/game";
import { QuerySuccess } from "types/makotools";
import useFSSList from "services/makotools/search";
import useUser from "services/firebase/user";
import SearchOptions from "components/core/SearchOptions";
import { gameRegions } from "pages/settings/content/Region";
import { SelectItemForwardRef } from "pages/settings/shared/SelectSetting";
import firstEraCardsJSON from "data/firstEraCards.json";
import Picture from "components/core/Picture";

const firstEraCards = firstEraCardsJSON as GameCardOld[];

const defaultView = {
  filters: {
    characters: [] as number[],
    eras: [] as string[],
  },
  search: "",
  sort: {
    type: "id",
    ascending: true,
  },
};

const ASSET_LIST_INITIAL_COUNT = 20;

interface AssetCard {
  era: string;
  id: number;
  character_id: number;
  rarity: CardRarity;
  name: { en: string; jp: string };
}

function Page({
  cardsQuery,
  unitsQuery,
  charactersQuery,
}: {
  cardsQuery: QuerySuccess<GameCard[]>;
  unitsQuery: QuerySuccess<GameUnit[]>;
  charactersQuery: QuerySuccess<GameCharacter[]>;
}) {
  const { t } = useTranslation("assets");
  const user = useUser();
  const theme = useMantineTheme();
  const { locale } = useRouter();
  const cards = useMemo(() => cardsQuery.data, [cardsQuery.data]);
  const units = useMemo(() => unitsQuery.data, [unitsQuery.data]);
  const characters = useMemo(
    () => charactersQuery.data,
    [charactersQuery.data]
  );

  const [count, setCount] = useState<number>(ASSET_LIST_INITIAL_COUNT);
  const [slicedAssetsList, setSlicedAssetsList] = useState<AssetCard[]>([]);

  const allCardsList: AssetCard[] = [
    ...cards.map((c) => ({
      era: "!!",
      id: c.id,
      character_id: c.character_id,
      rarity: c.rarity,
      name: {
        en: c.name[0],
        jp: c.name[1],
      },
    })),
    ...firstEraCards.map((c) => ({
      era: "!",
      id: c.id,
      character_id: c.character_id,
      rarity: c.rarity,
      name: c.name,
    })),
  ];

  const fssOptions = useMemo<FSSOptions<AssetCard, typeof defaultView.filters>>(
    () => ({
      filters: [
        {
          type: "characters",
          values: [],
          function: (view) => {
            return (c) => view.filters.characters.includes(c.character_id);
          },
        },
        {
          type: "eras",
          values: [],
          function: (view) => {
            return (c) => view.filters.eras.includes(c.era);
          },
        },
      ],
      sorts: [
        {
          label: t("search.id"),
          value: "id",
          function: (a, b) => a.id - b.id,
        },
        {
          label: t("search.characters"),
          value: "character",
          function: (a, b) =>
            characterIDtoSort[a.character_id] -
            characterIDtoSort[b.character_id],
        },
      ],
      baseSort: "id",
      search: {
        fields: ["name.en", "name.jp"],
      },
      defaultView,
    }),
    [t]
  );
  const { results, view, setView } = useFSSList<
    AssetCard,
    typeof defaultView.filters
  >(allCardsList, fssOptions);

  const [viewOptions, setViewOptions] = useLocalStorage({
    key: "viewOptions__event",
    defaultValue: {
      region:
        (user.loggedIn && user.db?.setting__game_region) ||
        ("en" as GameRegion),
      density: "full" as "full" | "compact",
    },
  });

  const [bookmarks, handlers] = useListState<number>(
    user.loggedIn ? user.db.bookmarks__events || [] : []
  );

  let characterIDtoSort: { [key: number]: number } = {};
  characters.forEach((c) => {
    characterIDtoSort[c.character_id] = c.sort_id;
  });

  useEffect(() => {
    setSlicedAssetsList(results.slice(0, count));
  }, [results, count]);

  const loadMore = () => {
    const newCount = count + ASSET_LIST_INITIAL_COUNT;
    setCount(newCount);
  };

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
            <Input.Wrapper id="type" label="Eras">
              <Chip.Group
                multiple
                value={view.filters.eras}
                onChange={(val) => {
                  setView((v) => ({
                    ...v,
                    filters: {
                      ...v.filters,
                      eras: val,
                    },
                  }));
                }}
                spacing={3}
              >
                {[
                  { value: "!", label: "!" },
                  { value: "!!", label: "!!" },
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

      {slicedAssetsList.length ? (
        <>
          <Text color="dimmed" mt="xl" mb="sm" size="sm">
            {t("common:search.resultsFound", { count: results.length })}
          </Text>
          <InfiniteScroll
            dataLength={slicedAssetsList.length}
            next={loadMore}
            hasMore={count < results.length}
            loader={
              <Center sx={{ gridColumn: "s/e" }} my="lg">
                <Loader variant="bars" />
              </Center>
            }
            style={{
              display: "grid",
              gridTemplateColumns:
                "[s] repeat(auto-fill, minmax(240px, 1fr)) [e]",
              gap: theme.spacing.xs,
              alignItems: "flex-start",
            }}
          >
            {slicedAssetsList.map((card, i) => (
              <Card withBorder p={0} key={card.id}>
                <Card.Section sx={{ position: "relative" }} px={3} pt={3}>
                  <Group
                    sx={{
                      "&:hover picture": { opacity: 0.25 },
                    }}
                    spacing={3}
                  >
                    {["normal", "evolution"].map((type) => (
                      <Picture
                        key={type}
                        sx={{
                          height: 100,
                          flexBasis: 0,
                          flexShrink: 1,
                          flexGrow: 1,
                          maxWidth: "100%",
                          transition: theme.other.transition,
                          img: {
                            width: "100%",
                            objectPosition: "top center",
                          },
                          ".mantine-ActionIcon-root": {
                            opacity: 0,
                            transition: theme.other.transition,
                          },
                          "&&:hover": {
                            flexGrow: 1.1,
                            opacity: 1,
                            ".mantine-ActionIcon-root": {
                              opacity: 1,
                            },

                            ".mantine-Paper-root": {
                              left: -12.5 - 30,
                            },
                          },
                        }}
                        srcB2={
                          card.era === "!"
                            ? `assets_1/cs_${card.id}_${type}.png` // 4-5 -> full cg
                            : `assets/card_rectangle4_${card.id}_${type}.png` // 1-3 -> frameless
                        }
                        alt={card.name?.en || card.name?.jp || ""}
                        radius={3}
                        action="download"
                      >
                        {type === "normal" && (
                          <Paper
                            component={Box}
                            sx={{
                              position: "absolute",
                              top: 9,
                              left: -12.5,
                              borderTopRightRadius: theme.radius.sm,
                              borderBottomRightRadius: theme.radius.sm,
                              transform: "skew(-15deg)",
                              pointerEvents: "none",
                              zIndex: 12,
                              transition: "0.3s cubic-bezier(.19,.73,.37,.93)",
                            }}
                            pl={20}
                            pr={10}
                            py={2}
                            radius={0}
                          >
                            <Text
                              size="xs"
                              weight="700"
                              sx={{
                                transform: "skew(15deg)",
                                fontFeatureSettings: "'kern' 1, 'ss02' 1",
                              }}
                              color="white"
                            >
                              {card.rarity}
                              <IconStar
                                size={10}
                                strokeWidth={3}
                                style={{ verticalAlign: -1 }}
                              />
                            </Text>
                          </Paper>
                        )}
                      </Picture>
                    ))}
                  </Group>
                </Card.Section>
                <Card.Section px="sm" py="xs">
                  <Text
                    size="sm"
                    weight="700"
                    component={Link}
                    href={`/cards/${card.id}`}
                  >
                    {`${card.name.en ?? card.name.jp}`}
                  </Text>
                  {card.name.en && (
                    <Text size="xs" color="dimmed" weight="500">
                      {`${card.name.jp}`}
                    </Text>
                  )}
                </Card.Section>
              </Card>
            ))}
          </InfiniteScroll>
        </>
      ) : (
        <Text align="center" color="dimmed" mt="xl" mb="sm" size="sm">
          No cards found.
        </Text>
      )}
    </>
  );
}

export const getServerSideProps = getServerSideUser(async ({ locale }) => {
  const cardsQuery: any = await getLocalizedDataArray<GameCard>(
    "cards",
    "en",
    "id",
    ["id", "character_id", "rarity", "name"]
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

  // const events: Event[] = retrieveEvents(
  //   {
  //     gameEvents: getEvents.data,
  //   },
  //   locale
  // ) as Event[];

  return {
    props: {
      cardsQuery,
      unitsQuery,
      charactersQuery,
    },
  };
});

Page.getLayout = getLayout({ wide: true });
export default Page;
