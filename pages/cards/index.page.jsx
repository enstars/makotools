import { useState, useEffect } from "react";

import {
  useMantineTheme,
  Text,
  Paper,
  Group,
  Select,
  Chip,
  Input,
  Center,
  Loader,
  Switch,
  MultiSelect,
  Button,
} from "@mantine/core";
import InfiniteScroll from "react-infinite-scroll-component";

import { useLocalStorage } from "@mantine/hooks";

import { IconArrowsSort, IconSearch } from "@tabler/icons";
import { slice } from "lodash";

import Layout from "../../components/Layout";

import { getLocalizedData } from "../../services/ensquare";
import PageTitle from "../../components/sections/PageTitle";

import { getLayout } from "../../components/Layout";
import getServerSideUser from "../../services/firebase/getServerSideUser";

import CardCard from "./components/DisplayCard";

const CARD_LIST_INITIAL_COUNT = 20;
const CARD_VIEW_OPTIONS_DEFAULT = {
  filterRarity: [5],
  filterCharacters: [],
  sortOption: "id",
};

function Page({ cards, characters }) {
  // console.log(characters);

  const theme = useMantineTheme();
  const [count, setCount] = useState(CARD_LIST_INITIAL_COUNT);
  const [cardsList, setCardsList] = useState([]);
  const [slicedCardsList, setSlicedCardsList] = useState([]);
  const [viewOptions, setViewOptions] = useLocalStorage({
    key: "cardFilters",
    defaultValue: CARD_VIEW_OPTIONS_DEFAULT,
  });
  const [cardOptions, setCardOptions] = useLocalStorage({
    key: "cardOptions",
    defaultValue: {
      showFullInfo: false,
    },
  });

  let characterIDtoSort = {};
  characters.main.data.forEach((c) => {
    characterIDtoSort[c.character_id] = c.sort_id || c.character_id;
  });

  const SORT_OPTIONS = [
    { value: "id", label: "Card ID" },
    {
      value: "character",
      label: "Character",
    },
  ];

  const SORT_FUNCTIONS = {
    id: (a, b) => a.id > b.id,
    character: (a, b) =>
      characterIDtoSort[a.character_id] > characterIDtoSort[b.character_id],
  };

  useEffect(() => {
    const filteredList = cards.main.data
      .filter((c) => {
        return c.id <= 9999;
      })
      .filter((c) => {
        return viewOptions.filterRarity.includes(c.rarity);
      })
      .filter((c) => {
        if (viewOptions.filterCharacters.length)
          return viewOptions.filterCharacters.includes(
            c.character_id.toString()
          );
        return true;
      })
      .sort(SORT_FUNCTIONS["id"])
      .sort(SORT_FUNCTIONS[viewOptions.sortOption]);
    setCardsList(filteredList);
    setCount(CARD_LIST_INITIAL_COUNT);
  }, [viewOptions]);

  useEffect(() => {
    setSlicedCardsList(cardsList.slice(0, count));
  }, [cardsList, count]);

  const loadMore = () => {
    const newCount = count + CARD_LIST_INITIAL_COUNT;
    setCount(newCount);
  };

  return (
    <div className="content-text">
      <PageTitle title="Cards" />

      <Paper mb="sm" p="md" withBorder>
        <Text weight="700" size="xs" color="dimmed">
          <IconSearch size="1em" /> Search Options
        </Text>
        <Group sx={{ alignItems: "flex-start" }}>
          <Select
            label="Sort by"
            placeholder="Pick a unit..."
            data={SORT_OPTIONS}
            value={viewOptions.sortOption}
            onChange={(val) => {
              setViewOptions({ ...viewOptions, sortOption: val });
            }}
            sx={{ maxWidth: 200 }}
            variant="default"
            icon={<IconArrowsSort size="1em" />}
          />
          <MultiSelect
            label="Characters"
            placeholder="Pick a character..."
            data={characters.mainLang.data.map((c) => {
              return { value: c.character_id.toString(), label: c.first_name };
            })}
            value={viewOptions.filterCharacters}
            onChange={(val) => {
              setViewOptions({ ...viewOptions, filterCharacters: val });
            }}
            sx={{ width: "100%", maxWidth: 400 }}
            variant="default"
            searchable
          />
          <Input.Wrapper id="rarity" label="Rarity">
            <Chip.Group
              multiple
              value={viewOptions.filterRarity.map((v) => v.toString())}
              onChange={(value) => {
                const filterRarity = value.map((v) => parseInt(v, 10));
                console.log(filterRarity);
                setViewOptions({ ...viewOptions, filterRarity });
              }}
              spacing={3}
            >
              {[4, 5].map((r) => (
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
        </Group>
        <Group mt="xs">
          <Switch
            label="Show full info"
            checked={cardOptions.showFullInfo}
            onChange={(event) =>
              setCardOptions({
                ...cardOptions,
                showFullInfo: event.currentTarget.checked,
              })
            }
          />
          <Button
            compact
            onClick={() => {
              setViewOptions(CARD_VIEW_OPTIONS_DEFAULT);
            }}
          >
            Reset all filters
          </Button>
        </Group>
      </Paper>
      {slicedCardsList.length}
      {slicedCardsList.length ? (
        <>
          <Text color="dimmed" mt="xl" mb="sm" size="sm">
            {cardsList.length} results found.
          </Text>
          <InfiniteScroll
            dataLength={slicedCardsList.length} //This is important field to render the next data
            next={loadMore}
            hasMore={count < cardsList.length}
            loader={
              <Center sx={{ gridColumn: "s/e" }} my="lg">
                <Loader variant="bars" />
              </Center>
            }
            // endMessage={
            //   // <p style={{ textAlign: "center" }}>
            //   //   <b>You reached the end!</b>
            //   // </p>
            // }
            style={{
              display: "grid",
              gridTemplateColumns:
                "[s] repeat(auto-fill, minmax(224px, 1fr)) [e]",
              gap: theme.spacing.xs,
              alignItems: "flex-start",
            }}
          >
            {slicedCardsList.map((e, i) => (
              <CardCard
                key={e.id}
                cards={cards}
                i={i}
                id={e.id}
                characters={characters.main.data}
                cardOptions={cardOptions}
              />

              // <div
              //   key={e.id}
              //   cards={cards}
              //   i={i}
              //   id={e.id}
              //   characters={characters.main.data}
              //   cardOptions={cardOptions}
              // >
              //   {e.id}
              // </div>
            ))}
          </InfiniteScroll>
        </>
      ) : (
        <Text align="center" color="dimmed" mt="xl" mb="sm" size="sm">
          No cards found.
        </Text>
      )}
    </div>
  );
}

export const getServerSideProps = getServerSideUser(async ({ res, locale }) => {
  const characters = await getLocalizedData("characters", locale, [
    "character_id",
    "first_name",
  ]);
  // const unit_to_characters = await getLocalizedData("unit_to_characters");
  // const units = await getLocalizedData("units");
  const cards = await getLocalizedData("cards", locale, [
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
  ]);

  return {
    props: { characters, cards },
  };
});

Page.getLayout = getLayout({});
export default Page;
