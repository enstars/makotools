import { CharacterCard } from "./../../components/characters/CharacterCard";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import styled from "styled-components";
import _ from "lodash";
import { getData, getB2File } from "../../services/ensquare";
import Title from "../../components/Title";
import Main from "../../components/Main";
import Dropdown from "../../components/core/Dropdown";
import {
  Select,
  Box,
  Paper,
  Group,
  Text,
  useMantineTheme,
} from "@mantine/core";
const StyledWrapper = styled.div`
  .header-render {
    position: absolute;
    bottom: -110px;
    right: -30px;
    height: 300px;
    width: 300px;
    z-index: 0;
  }
  .es-characterList {
    display: grid;
    gap: 10px;
    grid-template-columns: 
    list-style-type: none;
    margin: 0;
    padding: 0;
  }

  .filters {
    margin: var(--content-margin) 0;
    display: flex;
    justify-content: flex-end;
  }
`;

function Characters({ characters, unit_to_characters, units }) {
  //   console.debug(twoStarIDs);
  const [listCharacters, setListCharacters] = useState([]);
  const [filterOptions, setfilterOptions] = useState([]);
  const [chosenUnit, setChosenUnit] = useState(null);
  const theme = useMantineTheme();
  useEffect(() => {
    let charactersWithUnits = unit_to_characters;

    if (chosenUnit) {
      const filterOptionsChosenID = chosenUnit.unit_id;
      console.log(filterOptionsChosenID);
      charactersWithUnits = charactersWithUnits.filter(
        (character) => filterOptionsChosenID === character.unit_id
      );
      console.log(charactersWithUnits);
    }
    const charactersWithUnitsSorted = _.sortBy(charactersWithUnits, [
      function findUnitOrder(charactersWithUnit) {
        const thisUnit = units.filter(
          (unit) => unit.unit_id === charactersWithUnit.unit_id
        )[0] || {
          name: "MaM",
          order: 14,
        }; // MaM *sobs*
        // eslint-disable-next-line dot-notation
        return thisUnit.order;
      },
      "order_num_in_unit_as_list",
    ]);

    const charactersFiltered = charactersWithUnitsSorted.map((charaUnit) => {
      const char = JSON.parse(
        JSON.stringify(
          characters.filter(
            (chara) => chara.character_id === charaUnit.character_id
          )[0]
        )
      );
      // console.log(charaUnit.unit_id);
      if (charaUnit.unit_id === 17) {
        char.doubleface = true;
        // console.log(".");
      } else {
        char.doubleface = false;
      }
      char.unique_id = `${char.character_id}-${charaUnit.unit_id}`;

      return char;
    });

    setListCharacters(charactersFiltered);
    setfilterOptions(units.sort((a, b) => !!(a?.order > b?.order)));
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
            // placeholder=""
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
            // sx={{ maxWidth: 200 }}
            size="sm"
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
        {listCharacters.map((character, i) => {
          // console.log(character);
          return (
            <CharacterCard key={character.unique_id} character={character} />
          );
        })}
      </Box>
    </>
  );
}

export default Characters;

// // This function gets called at build time
//   const queryClient = new QueryClient();

//   await queryClient.prefetchQuery("characters", getData("characters"));
//   await queryClient.prefetchQuery(
//     "unit_to_characters",
//     getData("unit_to_characters")
//   );
//   await queryClient.prefetchQuery("units", getData("units"));

//   return {
//     props: {
//       dehydratedState: dehydrate(queryClient),
//     },
//   };
// }

export async function getServerSideProps({ res }) {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=7200, stale-while-revalidate=172800"
  );
  // refresh every 2 hours, stale for 48hrs

  const characters = await getData("characters");
  const unit_to_characters = await getData("unit_to_characters");
  const units = await getData("units");

  return {
    props: { characters, unit_to_characters, units },
  };
}

import Layout from "../../components/Layout";
Characters.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
