import { useState, useEffect, useMemo } from "react";
import {
  useMantineTheme,
  Text,
  Center,
  Loader,
  Group,
  Select,
  MultiSelect,
  Input,
  Chip,
  Tooltip,
  ActionIcon,
  Switch,
  SegmentedControl,
  Box,
} from "@mantine/core";
import InfiniteScroll from "react-infinite-scroll-component";
import { useLocalStorage } from "@mantine/hooks";
import useTranslation from "next-translate/useTranslation";
import {
  IconArrowsSort,
  IconSortAscending,
  IconSortDescending,
} from "@tabler/icons-react";
import { GetStaticProps } from "next";

import NewCollectionModal from "./components/NewCollectionModal";

import { CardCard } from "components/core/CardCard";
import PageTitle from "components/sections/PageTitle";
import { getLayout } from "components/Layout";
import { QuerySuccess } from "types/makotools";
import { getLocalizedDataArray } from "services/data";
import { CardRarity, GameCard, GameCharacter } from "types/game";
import { useCollections } from "services/makotools/collection";
import SearchOptions from "components/core/SearchOptions";
import useFSSList from "services/makotools/search";
import useUser from "services/firebase/user";
import { DEFAULT_LOCALE } from "services/makotools/locales";
import { useDayjs } from "services/libraries/dayjs";

const CARD_LIST_INITIAL_COUNT = 20;

const defaultView = {
  filters: {
    rarity: [5],
    characters: [] as number[],
    region__temp: "any" as "all" | "global" | "any",
  },
  search: "",
  sort: {
    type: "releaseDate",
    ascending: false,
  },
};

function Page({
  charactersQuery,
  cardsQuery,
}: {
  charactersQuery: QuerySuccess<GameCharacter[]>;
  cardsQuery: QuerySuccess<GameCard[]>;
}) {
  const { userDB } = useUser();
  const { dayjs } = useDayjs();
  const cards = useMemo(() => cardsQuery.data, [cardsQuery.data]);
  const characters = useMemo(
    () => charactersQuery.data,
    [charactersQuery.data]
  );
  const { t } = useTranslation("cards");
  const theme = useMantineTheme();
  const [count, setCount] = useState<number>(CARD_LIST_INITIAL_COUNT);
  const [slicedCardsList, setSlicedCardsList] = useState<GameCard[]>([]);
  const [cardOptions, setCardOptions] = useLocalStorage({
    key: "cardOptions",
    defaultValue: {
      showFullInfo: false,
    },
  });
  const [newCollectionModalOpened, setNewCollectionModalOpened] =
    useState<boolean>(false);
  const { collections, editCollection, createCollection } = useCollections();

  const characterIDtoSort = useMemo<{ [key: number]: number }>(() => {
    let result: { [key: number]: number } = {};
    characters.forEach((c) => {
      result[c.character_id] = c.sort_id;
    });
    return result;
  }, [characters]);

  const fssOptions = useMemo<FSSOptions<GameCard, typeof defaultView.filters>>(
    () => ({
      filters: [
        {
          type: "rarity",
          values: [],
          function: (view) => {
            return (c: GameCard) => view.filters.rarity.includes(c.rarity);
          },
        },
        {
          type: "characters",
          values: [],
          function: (view) => {
            return (c: GameCard) =>
              view.filters.characters.includes(c.character_id);
          },
        },
        {
          type: "region__temp",
          values: ["all", "global", "any"],
          function: (view) => {
            return (c: GameCard) => {
              if (view.filters.region__temp === "any") return true;
              const cardId = c.id;
              const cardIsGlobal = cardId >= 10000;
              return cardIsGlobal === (view.filters.region__temp === "global");
            };
          },
        },
      ],
      sorts: [
        {
          label: t("search.cardId"),
          value: "id",
          function: (a: GameCard, b: GameCard) => a.id - b.id,
        },
        {
          label: t("search.character"),
          value: "character",
          function: (a: GameCard, b: GameCard) =>
            characterIDtoSort[a.character_id] -
            characterIDtoSort[b.character_id],
        },
        {
          label: t("search.releaseDate"),
          value: "releaseDate",
          function: (a: GameCard, b: GameCard) => {
            // dates are in the format "YYYY-MM-DD"
            const dateAEn = dayjs(a.releaseDate?.en || "3000-01-01").unix();
            const dateAJp = dayjs(a.releaseDate?.jp || "3000-01-01").unix();
            const dateA = Math.min(dateAEn, dateAJp);

            const dateBEn = dayjs(b.releaseDate?.en || "3000-01-01").unix();
            const dateBJp = dayjs(b.releaseDate?.jp || "3000-01-01").unix();
            const dateB = Math.min(dateBEn, dateBJp);

            return dateA - dateB;
          },
        },
      ],
      baseSort: "id",
      search: {
        fields: ["title.0", "title.1", "title.2"],
      },
      defaultView,
    }),
    [characterIDtoSort, t]
  );

  const { results, view, setView } = useFSSList<
    GameCard,
    typeof defaultView.filters
  >(cards, fssOptions);

  useEffect(() => {
    setSlicedCardsList(results.slice(0, count));
  }, [results, count]);

  const loadMore = () => {
    const newCount = count + CARD_LIST_INITIAL_COUNT;
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
          <Group sx={{ alignItems: "flex-start" }}>
            <Select
              label={t("common:search.sortLabel")}
              placeholder={t("search.sortPlaceholder")}
              onChange={(val: string) => {
                if (val) {
                  setView((v) => ({
                    ...v,
                    sort: {
                      ...v.sort,
                      type: val,
                    },
                  }));
                }
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
                .sort(
                  (a: any, b: any) =>
                    characterIDtoSort[a.character_id] -
                    characterIDtoSort[b.character_id]
                )
                .map((c) => {
                  return {
                    value: c.character_id.toString(),
                    label: c.first_name[0],
                  };
                })}
              value={
                view.filters.characters.length
                  ? view.filters.characters.map((v) => v.toString())
                  : []
              }
              onChange={(val) => {
                setView((v) => ({
                  ...v,
                  filters: {
                    ...v.filters,
                    characters: val.map((v) => parseInt(v, 10)),
                  },
                }));
              }}
              sx={{ width: "100%", maxWidth: 400 }}
              variant="default"
              searchable
            />
            <Input.Wrapper id="rarity" label={t("search.rarityLabel")}>
              <Chip.Group
                multiple
                value={view.filters.rarity?.map((v) => v.toString()) || []}
                onChange={(value) => {
                  const filterRarity = value.map(
                    (v) => parseInt(v, 10) as CardRarity
                  );
                  setView((v) => ({
                    ...v,
                    filters: {
                      ...v.filters,
                      rarity: filterRarity,
                    },
                  }));
                }}
                spacing={3}
              >
                {[1, 2, 3, 4, 5].map((r) => (
                  <Chip
                    key={r}
                    value={r.toString()}
                    radius="md"
                    styles={{
                      label: { paddingLeft: 10, paddingRight: 10 },
                      iconWrapper: { display: "none" },
                    }}
                    color="yellow"
                    variant="filled"
                  >
                    {r}
                  </Chip>
                ))}
              </Chip.Group>
            </Input.Wrapper>

            <Input.Wrapper label={t("common:search.density")}>
              <SegmentedControl
                sx={{ display: "flex" }}
                value={view.filters.region__temp}
                onChange={(value) => {
                  setView((v) => ({
                    ...v,
                    filters: {
                      ...v.filters,
                      region__temp: value as "all" | "global" | "any",
                    },
                  }));
                }}
                data={[
                  {
                    value: "any",
                    label: (
                      <Center>
                        <Box>{t("search.region__temp.any")}</Box>
                      </Center>
                    ),
                  },
                  {
                    value: "all",
                    label: (
                      <Center>
                        <Box>{t("search.region__temp.all")}</Box>
                      </Center>
                    ),
                  },
                  {
                    value: "global",
                    label: (
                      <Center>
                        <Box>{t("search.region__temp.global")}</Box>
                      </Center>
                    ),
                  },
                ]}
              />
            </Input.Wrapper>
          </Group>
        }
        display={
          <Group>
            <Switch
              label={t("search.showFullInfo")}
              checked={cardOptions.showFullInfo}
              onChange={(event) =>
                setCardOptions({
                  ...cardOptions,
                  showFullInfo: event.currentTarget.checked,
                })
              }
            />
          </Group>
        }
      />
      {slicedCardsList.length ? (
        <>
          <Text color="dimmed" mt="xl" mb="sm" size="sm">
            {t("resultsFound", { count: results.length })}
          </Text>
          <InfiniteScroll
            dataLength={slicedCardsList.length}
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
                "[s] repeat(auto-fill, minmax(224px, 1fr)) [e]",
              gap: theme.spacing.xs,
              alignItems: "flex-start",
            }}
          >
            {slicedCardsList.map((e) => (
              <CardCard
                key={e.id}
                card={e}
                character={
                  characters.find(
                    (c) => c.character_id === e.character_id
                  ) as GameCharacter
                }
                cardOptions={cardOptions}
                collections={collections}
                lang={cardsQuery.lang}
                editCollection={editCollection}
                onNewCollection={() => setNewCollectionModalOpened(true)}
                gameRegion={(userDB && userDB?.setting__game_region) || "en"}
              />
            ))}
          </InfiniteScroll>
        </>
      ) : (
        <Text align="center" color="dimmed" mt="xl" mb="sm" size="sm">
          No cards found.
        </Text>
      )}
      <NewCollectionModal
        // use key to reset internal form state on close
        key={JSON.stringify(newCollectionModalOpened)}
        opened={newCollectionModalOpened}
        onClose={() => setNewCollectionModalOpened(false)}
        createCollection={createCollection}
      />
    </>
  );
}

export const getStaticProps = (async ({ locale: nextLocale }) => {
  const locale = nextLocale || DEFAULT_LOCALE;
  const characters = await getLocalizedDataArray<GameCharacter>(
    "characters",
    locale,
    "character_id",
    ["character_id", "first_name", "sort_id"]
  );
  const cards = await getLocalizedDataArray<GameCard>("cards", locale, "id", [
    "id",
    "name",
    "title",
    "type",
    "rarity",
    "stats.ir.da",
    "stats.ir.vo",
    "stats.ir.pf",
    "stats.ir4.da",
    "stats.ir4.vo",
    "stats.ir4.pf",
    "character_id",
    "releaseDate.en",
    "releaseDate.jp",
  ]);

  if (characters.status === "error" || cards.status === "error")
    throw new Error("Failed to fetch data");

  return {
    props: { charactersQuery: characters, cardsQuery: cards },
  };
}) satisfies GetStaticProps<{
  charactersQuery: QuerySuccess<GameCharacter[]>;
  cardsQuery: QuerySuccess<GameCard[]>;
}>;

Page.getLayout = getLayout({ wide: true });
export default Page;
