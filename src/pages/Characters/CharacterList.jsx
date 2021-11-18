import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { dehydrate, QueryClient, useQueries } from "react-query";
import _ from "lodash";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { getData, getB2File } from "../../services/ensquare";
// import "./CharacterList.module.scss";

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

function CharacterList() {
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
    useEffect(() => {
        // console.log("update!");
        if (hasAllData) {
            const [charactersQuery, unitToCharactersQuery, unitsQuery] =
                characterListQuery;
            let charactersWithUnits = unitToCharactersQuery.data;
            if (filterOptionsChosen.length > 0) {
                const filterOptionsChosenID = filterOptionsChosen.map(
                    (a) => a.id,
                );
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

            const characters = charactersWithUnitsSorted.map(
                (charaUnit) =>
                    charactersQuery.data.filter(
                        (chara) => chara.id === charaUnit.character_id,
                    )[0],
            );

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
        <div>
            <ToggleButtonGroup
                className="es-input__unitSelector"
                value={filterOptionsChosen}
                onChange={unitFilter.onChange}
                aria-label="units"
            >
                {filterOptions.map((option) => (
                    <ToggleButton value={option} aria-label={option.name}>
                        {option.name}
                    </ToggleButton>
                ))}
            </ToggleButtonGroup>
            <div className="es-characterList">
                {listCharacters.map((character) => (
                    <Link to={`/characters/${character.id}`}>
                        <a
                            className="es-characterList__character"
                            style={{
                                "--characterColor":
                                    character.personal_color_code,
                            }}
                        >
                            <div className="es-characterList__characterWrapper">
                                <div className="es-characterList__image">
                                    <Image
                                        src={getB2File(
                                            `render/character_full1_${character.id}.png`,
                                        )}
                                        alt={character.first_name}
                                        width="1000"
                                        height="1500"
                                    />
                                </div>
                                <div className="es-characterList__info">
                                    <span>
                                        {character.last_name}
                                        {character.first_name}
                                    </span>
                                </div>
                            </div>
                        </a>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default CharacterList;
