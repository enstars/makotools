import { CharacterCard } from "./../../components/characters/CharacterCard";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import styled from "styled-components";
import { dehydrate, QueryClient, useQueries } from "react-query";
import _ from "lodash";
import { getData, getB2File } from "../../services/ensquare";
import Title from "../../components/Title";
import Main from "../../components/Main";
import Dropdown from "../../components/library/Dropdown";

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
    grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
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

function Characters() {
  //   console.debug(twoStarIDs);
  const [randomCharacter, setRandomCharacter] = useState();
  const [listCharacters, setListCharacters] = useState([]);
  const [filterOptions, setfilterOptions] = useState([]);
  const [chosenUnit, setChosenUnit] = useState(null);

  const characterListQuery = useQueries([
    {
      queryKey: ["characters"],
      queryFn: () => getData("characters"),
    },
    {
      queryKey: ["unit_to_characters"],
      queryFn: () => getData("unit_to_characters"),
    },
    {
      queryKey: ["units"],
      queryFn: () => getData("units"),
    },
  ]);
  const hasAllData = characterListQuery.reduce(
    (hasData, query) => hasData && query.data,
    true
  );
  useEffect(() => setRandomCharacter(Math.floor(Math.random() * 49)), []);
  useEffect(() => {
    // console.log("update!");
    if (hasAllData) {
      const [charactersQuery, unitToCharactersQuery, unitsQuery] =
        characterListQuery;
      let charactersWithUnits = unitToCharactersQuery.data;

      if (chosenUnit) {
        const filterOptionsChosenID = chosenUnit.id;
        // console.log(filterOptionsChosenID);
        charactersWithUnits = charactersWithUnits.filter(
          (character) => filterOptionsChosenID === character.unit_id
        );
      }
      // console.log(charactersWithUnits);
      const charactersWithUnitsSorted = _.sortBy(charactersWithUnits, [
        function findUnitOrder(charactersWithUnit) {
          const thisUnit = unitsQuery.data.filter(
            (unit) => unit.id === charactersWithUnit.unit_id
          )[0] || {
            name: "MaM",
            order_num: 14,
          }; // MaM *sobs*
          // eslint-disable-next-line dot-notation
          return thisUnit.order_num;
        },
        "order_num_in_unit_as_list",
      ]);

      const characters = charactersWithUnitsSorted.map((charaUnit) => {
        const char = JSON.parse(
          JSON.stringify(
            charactersQuery.data.filter(
              (chara) => chara.id === charaUnit.character_id
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
        char.unique_id = `${char.id}-${charaUnit.unit_id}`;

        return char;
      });

      setListCharacters(characters);

      setfilterOptions(unitsQuery.data);
    }
  }, [hasAllData, chosenUnit]);

  const handleNewUnit = (e) => {
    setChosenUnit(e?.value);
  };

  // if (!hasAllData) {
  //     // This should probably be a more friendly loading state lol
  //     return null;
  // }

  return (
    <>
      <StyledWrapper>
        <Title title="Characters">
          <div className="header-render">
            <Image
              src={getB2File(
                `cards/card_full1_${2099 + randomCharacter}_normal.png`
              )}
              layout="fill"
              alt="header banner"
              objectFit="cover"
            ></Image>
          </div>
        </Title>
        <Main fullWidth={true}>
          <div className="filters">
            <Dropdown
              options={filterOptions.map((o) => {
                return {
                  value: o,
                  label: o.name,
                };
              })}
              onChange={handleNewUnit}
              isClearable
              placeholder="Unit"
              width={200}
            />
          </div>

          <div className="es-characterList">
            {listCharacters.map((character, i) => {
              // console.log(character);
              return (
                <CharacterCard
                  key={character.unique_id}
                  character={character}
                />
              );
            })}
          </div>
        </Main>
      </StyledWrapper>
    </>
  );
}

export default Characters;

// This function gets called at build time
export async function getStaticProps() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery("characters", getData("characters"));
  await queryClient.prefetchQuery(
    "unit_to_characters",
    getData("unit_to_characters")
  );
  await queryClient.prefetchQuery("units", getData("units"));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

import Layout from "../../components/Layout";
Characters.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
