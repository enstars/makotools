import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Paper,
  Group,
  Text,
  useMantineTheme,
  MultiSelect,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";

import CharacterCard from "./components/CharacterCard";

import PageTitle from "components/sections/PageTitle";
import { getLayout } from "components/Layout";
import { QuerySuccess } from "types/makotools";
import getServerSideUser from "services/firebase/getServerSideUser";
import { getLocalizedDataArray } from "services/data";
import { GameCharacter, GameUnit } from "types/game";

type SortOption = "default" | "id" | "birthday";
interface CharacterViewOptions {
  filterUnits: number[];
  sortOption: SortOption;
  searchQuery: string;
  sortDescending: boolean;
}

const CHARACTER_VIEW_OPTIONS_DEFAULT: CharacterViewOptions = {
  filterUnits: [],
  sortOption: "default",
  searchQuery: "",
  sortDescending: false,
};

function Page({
  charactersQuery,
  unitsQuery,
}: {
  charactersQuery: QuerySuccess<GameCharacter[]>;
  unitsQuery: QuerySuccess<GameUnit[]>;
}) {
  const characters = useMemo(() => charactersQuery.data, [charactersQuery]);
  const units = useMemo(() => unitsQuery.data, [unitsQuery]);

  const [listCharacters, setListCharacters] =
    useState<GameCharacter[]>(characters);
  const [viewOptions, setViewOptions] = useLocalStorage<CharacterViewOptions>({
    key: "characterFilters",
    defaultValue: CHARACTER_VIEW_OPTIONS_DEFAULT,
  });
  const theme = useMantineTheme();

  const descendingNum = viewOptions.sortDescending ? -1 : 1;
  const SORT_FUNCTIONS: { [key in SortOption]: any } = {
    default: (a: any, b: any) => (a.sort_id - b.sort_id) * descendingNum,
    id: (a: any, b: any) => (a.id - b.id) * descendingNum,
    birthday: (a: any, b: any) =>
      a.birthday.localeCompare(b.birthday) * descendingNum,
  };

  useEffect(() => {
    let filteredList: GameCharacter[] = characters
      .filter((c) => {
        return c.character_id <= 9999;
      })
      .filter((c) => {
        if (viewOptions.filterUnits.length)
          return viewOptions.filterUnits.filter((u) => c.unit.includes(u))
            .length;
        return true;
      })
      .sort(SORT_FUNCTIONS["id"])
      .sort(SORT_FUNCTIONS[viewOptions.sortOption]);
    setListCharacters(filteredList);
  }, [viewOptions]);

  const handleNewUnit = (e: string[]) => {
    setViewOptions((v) => ({ ...v, filterUnits: e.map((u) => parseInt(u)) }));
  };

  return (
    <>
      <PageTitle title="Characters" />
      <Paper mb="sm" p="md" withBorder>
        <Text weight="700" size="xs" color="dimmed">
          Search Options
        </Text>
        <Group>
          <MultiSelect
            label="Unit"
            placeholder="Pick a unit..."
            data={units
              .sort((a, b) => a.order - b.order)
              .map((o) => ({
                label: o.name[0],
                value: o.id.toString(),
              }))}
            onChange={handleNewUnit}
            searchable
            clearable
            size="sm"
            variant="default"
            value={viewOptions.filterUnits.map((u) => u.toString())}
          />
        </Group>
      </Paper>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr));",
          gap: theme.spacing.xs,
        }}
      >
        {listCharacters.map((character) => {
          return (
            <CharacterCard
              key={character.character_id}
              character={character}
              locale={charactersQuery.lang}
            />
          );
        })}
      </Box>
    </>
  );
}

export const getServerSideProps = getServerSideUser(async ({ res, locale }) => {
  const charactersQuery = await getLocalizedDataArray(
    "characters",
    locale,
    "character_id"
  );
  const unitsQuery = await getLocalizedDataArray("units", locale);

  return {
    props: { charactersQuery, unitsQuery },
  };
});

Page.getLayout = getLayout({ wide: true });
export default Page;
