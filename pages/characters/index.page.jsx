import { CharacterCard } from "./../../components/characters/CharacterCard";
import React, { useState, useEffect } from "react";
import _ from "lodash";
import { getLocalizedData } from "../../services/ensquare";
import Title from "../../components/PageTitle";
import {
  Select,
  Box,
  Paper,
  Group,
  Text,
  useMantineTheme,
} from "@mantine/core";

function Characters({
  characters,
  unit_to_characters: unitToCharacters,
  units,
}) {
  const [listCharacters, setListCharacters] = useState([]);
  const [filterOptions, setfilterOptions] = useState([]);
  const [chosenUnit, setChosenUnit] = useState(null);
  const theme = useMantineTheme();
  useEffect(() => {
    let charactersWithUnits = unitToCharacters.main.data;

    if (chosenUnit) {
      const filterOptionsChosenID = chosenUnit.unit_id;
      charactersWithUnits = charactersWithUnits.filter(
        (character) => filterOptionsChosenID === character.unit_id
      );
    }
    const charactersWithUnitsSorted = _.sortBy(charactersWithUnits, [
      function findUnitOrder(charactersWithUnit) {
        const thisUnit = units.main.data.filter(
          (unit) => unit.unit_id === charactersWithUnit.unit_id
        )[0] || {
          name: "MaM",
          order: 14,
        }; // MaM *sobs* mama... cries
        // eslint-disable-next-line dot-notation
        return thisUnit.order;
      },
      "order_num_in_unit_as_list",
    ]);

    const charactersFiltered = charactersWithUnitsSorted.map((charaUnit) => {
      const charIndex = characters.main.data.indexOf(
        characters.main.data.filter(
          (chara) => chara.character_id === charaUnit.character_id
        )[0]
      );

      return {
        i: charIndex,
        doubleface: charaUnit.unit_id === 17,
        unique_id: `${characters.main.data?.[charIndex]?.character_id}-${charaUnit.unit_id}`,
      };
    });

    setListCharacters(charactersFiltered);
    setfilterOptions(units.main.data.sort((a, b) => !!(a?.order > b?.order)));
  }, [chosenUnit]);

  const handleNewUnit = (e) => {
    setChosenUnit(e);
  };

  // if (!hasAllData) {
  //     // This should probably be a more friendly loading state lol
  //     return null;
  // }

  return (
    <>
      <Title title="Characters" />
      <Paper mb="sm" p="md" withBorder>
        <Text weight="700" size="xs" color="dimmed">
          Search Options
        </Text>
        <Group>
          <Select
            label="Unit"
            placeholder="Pick a unit..."
            data={filterOptions.map((o) => {
              return {
                value: o,
                label: o.unit_name,
              };
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

export default Characters;

export async function getServerSideProps({ res, locale }) {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=7200, stale-while-revalidate=172800"
  );
  // refresh every 2 hours, stale for 48hrs
  const characters = await getLocalizedData("characters", locale);
  const unit_to_characters = await getLocalizedData(
    "unit_to_characters",
    locale
  );
  const units = await getLocalizedData("units", locale);

  return {
    props: { characters, unit_to_characters, units },
  };
}

import Layout from "../../components/Layout";
Characters.getLayout = function getLayout(page) {
  return <Layout wide>{page}</Layout>;
};