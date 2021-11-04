import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQueries } from "react-query";
import Multiselect from "multiselect-react-dropdown";
import { getData, getB2File } from "../../services/ensquare";
import "./CharacterList.scss";

function CharacterList() {
    const [listCharacters, setListCharacters] = useState([]);
    const [filterList, setFilterList] = useState([]);
    const [filterChoice, setFilterChoice] = useState([]);
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
        if (hasAllData) {
            const [charactersQuery, unitToCharactersQuery, unitsQuery] =
                characterListQuery;
            let charactersWithUnits = unitToCharactersQuery.data;
            if (filterList.length > 0) {
                charactersWithUnits = charactersWithUnits.filter((character) =>
                    filterChoice.map((a) => a.id).includes(character.unit_id),
                );
            }
            const characters = charactersWithUnits.map(
                (charaUnit) =>
                    charactersQuery.data.filter(
                        (chara) => chara.id === charaUnit.character_id,
                    )[0],
            );
            setListCharacters(characters);

            setFilterList(unitsQuery.data);
        }
    }, [hasAllData]);

    const unitFilter = {
        onSelect(selectedList, selectedItem) {
            setFilterChoice(selectedList);
            console.log(filterChoice);
        },
        onRemove(selectedList, removedItem) {
            setFilterChoice(selectedList);
            console.log(filterChoice);
        },
    };

    if (!hasAllData) {
        // This should probably be a more friendly loading state lol
        return null;
    }

    return (
        <div>
            <Multiselect
                options={filterList} // Options to display in the dropdown
                // selectedValues={this.state.selectedValue} // Preselected value to persist in dropdown
                onSelect={unitFilter.onSelect} // Function will trigger on select event
                onRemove={unitFilter.onRemove} // Function will trigger on remove event
                displayValue="name"
            />
            <div className="es-characterList">
                {listCharacters.map((character) => (
                    <Link
                        to={`/characters/${character.id}`}
                        className="es-characterList__character"
                    >
                        {/* <img src={getB2File(`icon/character_sd_square1_${character.id}.png`)} alt={character.first_name} /> */}
                        <img
                            src={getB2File(
                                `render/character_full1_${character.id}.png`,
                            )}
                            alt={character.first_name}
                        />
                        <div className="es-characterList__info">
                            <span>
                                {character.last_name}
                                {character.first_name}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default CharacterList;
