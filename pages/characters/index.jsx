import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styled from "styled-components";
import { dehydrate, QueryClient, useQueries } from "react-query";
import _ from "lodash";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { getData, getB2File } from "../../services/ensquare";
import Title from "../../components/Title";
// import "./CharacterList.module.scss";

// import CharacterList from "./CharacterList";
import Main from "../../components/Main";
import { Chat } from "@mui/icons-material";
import { twoStarIDs } from "../../data/characterIDtoCardID";

const StyledWrapper = styled.div`
  .header-render {
    position: absolute;
    bottom: -120px;
    right: -30px;
    height: 300px;
    width: 300px;
    z-index: 0;
  }
  .es-characterList {
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    list-style-type: none;
    margin: 0;
    padding: 0;
  }

  .es-characterList__character {
    height: 180px;
    gap: 15px;
    color: inherit;
    text-decoration: none;
    position: relative;

    z-index: 1;

    * {
      transition: all 0.5s cubic-bezier(0, 1, 0, 1);
    }
  }

  .es-characterList__characterWrapper {
    overflow: hidden;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: 0% 100%/220% 100% no-repeat
      linear-gradient(315deg, var(--characterColor) 0%, transparent 100%);
    border-radius: 5px;
    z-index: 2;
    transition: all 0.5s cubic-bezier(0, 1, 0, 1), background 0.2s ease;

    .es-characterList__image {
      position: relative;
      left: 50%;
      transform: translateX(-50%);
      width: 400px;
      height: 180px;
      z-index: 1;
      pointer-events: none;

      &.bloomed {
        visibility: hidden;
        top: -100%;
        z-index: -5;
      }
    }

    .es-characterList__info {
      pointer-events: none;
      position: absolute;
      top: 0px;
      right: 0%;
      padding: 5px 3px 3px 5px;
      font-weight: 900;
      z-index: 2;
      color: white;
      background: hsla(0, 0%, 0%, 0.6);
      width: 1.5em;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      justify-content: center;
      transform: translate(100%, 0%);
      writing-mode: vertical-lr;
      text-orientation: mixed;
      width: 40px;
      padding-right: 18px;
    }

    &:hover {
      z-index: 3;
      background-position: 100% 100%;
      @include m.card(1);

      .es-characterList__image {
        transform: translateX(calc(-50% - 0.5em));
        visibility: hidden;
        &.bloomed {
          visibility: visible;
          z-index: 2;
        }
      }

      .es-characterList__info {
        transform: translate(15px, 0%);
      }
    }
  }

  .es-input__unitSelector {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    margin: 0px 0px 10px;
    justify-content: flex-start;

    button.MuiButtonBase-root.MuiToggleButton-root {
      flex-grow: 0;
      background: hsla(0, 0%, 100%, 0.2);
      border: 0;
      border-radius: 5px;
      margin: 0;
      font: inherit;
      font-size: 0.9rem;
      text-transform: none;
      padding: 0.5em 0.7em;
      line-height: 1;
      font-weight: 800;
      justify-self: flex-start;

      &.Mui-selected {
        background: white;
        color: black;
      }
    }
  }
`;

function Characters() {
  //   console.debug(twoStarIDs);
  const [randomCharacter, setRandomCharacter] = useState();
  const [listCharacters, setListCharacters] = useState([]);
  const [filterOptions, setfilterOptions] = useState([]);
  const [filterOptionsChosen, setfilterOptionsChosen] = useState([]);

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
    true,
  );
  useEffect(() => setRandomCharacter(Math.floor(Math.random() * 49)), []);
  useEffect(() => {
    // console.log("update!");
    if (hasAllData) {
      const [charactersQuery, unitToCharactersQuery, unitsQuery] =
        characterListQuery;
      let charactersWithUnits = unitToCharactersQuery.data;
      if (filterOptionsChosen.length > 0) {
        const filterOptionsChosenID = filterOptionsChosen.map((a) => a.id);
        // console.log(filterOptionsChosenID);
        charactersWithUnits = charactersWithUnits.filter((character) =>
          filterOptionsChosenID.includes(character.unit_id),
        );
      }
      // console.log(charactersWithUnits);
      const charactersWithUnitsSorted = _.sortBy(charactersWithUnits, [
        function findUnitOrder(charactersWithUnit) {
          const thisUnit = unitsQuery.data.filter(
            (unit) => unit.id === charactersWithUnit.unit_id,
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
              (chara) => chara.id === charaUnit.character_id,
            )[0],
          ),
        );
        // console.log(charaUnit.unit_id);
        if (charaUnit.unit_id === 17) {
          char.doubleface = true;
          // console.log(".");
        } else {
          char.doubleface = false;
        }

        return char;
      });

      setListCharacters(characters);

      setfilterOptions(unitsQuery.data);
    }
  }, [hasAllData, filterOptionsChosen]);

  const unitFilter = {
    onChange(event, selectedList) {
      const tempSelectedList = [...selectedList];
      setfilterOptionsChosen(tempSelectedList);
      // console.log(selectedList);
    },
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
                `cards/card_full1_${2099 + randomCharacter}_normal.png`,
              )}
              layout="fill"
              alt="header banner"
              objectFit="cover"
            ></Image>
          </div>
        </Title>
        <Main fullWidth={true}>
          <ToggleButtonGroup
            className="es-input__unitSelector"
            value={filterOptionsChosen}
            onChange={unitFilter.onChange}
            aria-label="units"
          >
            {filterOptions.map((option, i) => (
              <ToggleButton key={i} value={option} aria-label={option.name}>
                {option.name}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          <div className="es-characterList">
            {listCharacters.map((character, i) => {
              // console.log(character);
              return (
                <Link key={i} href={`/characters/${character.id}`}>
                  <a
                    className="es-characterList__character"
                    style={{
                      "--characterColor": character.personal_color_code,
                    }}
                  >
                    <div className="es-characterList__characterWrapper">
                      <div className="es-characterList__image">
                        <Image
                          src={
                            character.doubleface
                              ? getB2File(
                                  `cards/card_full1_${
                                    twoStarIDs.doubleface[character.id]
                                  }_normal.png`,
                                )
                              : getB2File(
                                  `cards/card_full1_${
                                    twoStarIDs[character.id]
                                  }_normal.png`,
                                )
                          }
                          alt={character.first_name}
                          // width="2000"
                          // height="2000"
                          layout="fill"
                          objectFit="contain"
                        />
                      </div>
                      <div className="es-characterList__image bloomed">
                        <Image
                          src={
                            character.doubleface
                              ? getB2File(
                                  `cards/card_full1_${
                                    twoStarIDs.doubleface[character.id]
                                  }_evolution.png`,
                                )
                              : getB2File(
                                  `cards/card_full1_${
                                    twoStarIDs[character.id]
                                  }_evolution.png`,
                                )
                          }
                          alt={character.first_name}
                          // width="2000"
                          // height="2000"
                          layout="fill"
                          objectFit="contain"
                        />
                      </div>
                      <div className="es-characterList__info">
                        <span>
                          {character.last_name}
                          {character.first_name}
                          {character.doubleface ? " (DF)" : ""}
                        </span>
                      </div>
                    </div>
                  </a>
                </Link>
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
    getData("unit_to_characters"),
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
