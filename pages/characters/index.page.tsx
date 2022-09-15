import React, { useState, useEffect } from "react";
import _ from "lodash";
import {
  Select,
  Box,
  Paper,
  Group,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";

import { getData, getLocalizedData } from "../../services/ensquare";
import PageTitle from "../../components/sections/PageTitle";
import { getLayout } from "../../components/Layout";
import getServerSideUser from "../../services/firebase/getServerSideUser";
import { LoadedData } from "../../types/makotools";

import CharacterCard from "./components/DisplayCard";

interface CharacterCardProps {
  i: number;
  doubleface: boolean;
  characters?: any;
  unique_id?: string;
}

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
  characters,
  unit_to_characters: unitToCharacters,
  units,
}: {
  characters: LoadedData<GameCharacter[]>;
  unit_to_characters: any;
  units: any;
}) {
  console.log(characters, unitToCharacters, units);

  const [listCharacters, setListCharacters] = useState<GameCharacter[]>(
    characters.main.data
  );
  const [filterOptions, setfilterOptions] = useState<GameUnit[]>([]);
  const [chosenUnit, setChosenUnit] = useState<string | null>(null);
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
    let filteredList: GameCharacter[] = characters.main.data
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
  }, [viewOptions, debouncedSearch]);

  const handleNewUnit = (e: string) => {
    setChosenUnit(e);
  };

  // if (!hasAllData) {
  //     // This should probably be a more friendly loading state lol
  //     return null;
  // }

  return (
    <>
      <PageTitle title="Characters" />
      <Paper mb="sm" p="md" withBorder>
        <Text weight="700" size="xs" color="dimmed">
          Search Options
        </Text>
        <Group>
          <Select
            label="Unit"
            placeholder="Pick a unit..."
            data={filterOptions.map((o: GameUnit) => {
              return o.unit_id + "";
            })}
            onChange={handleNewUnit}
            searchable
            clearable
            allowDeselect
            size="sm"
            variant="default"
          />
        </Group>
      </Paper>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr));",
          gap: theme.spacing.xs,
        }}
      >
        {listCharacters.map((character) => {
          return (
            <CharacterCard
              key={character.unique_id}
              {...character}
              characters={characters}
            />
          );
        })}
      </Box>
    </>
  );
}

export const getServerSideProps = getServerSideUser(async ({ res, locale }) => {
  const characters = await getLocalizedData("characters", locale);
  const unit_to_characters = await getData("unit_to_characters", "ja", true);
  const units = await getData("units", "ja", true);

  console.log("units", units);

  return {
    props: { characters, unit_to_characters, units },
  };
});
Page.getLayout = getLayout({ wide: true });
export default Page;
