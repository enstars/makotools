import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Multiselect from "multiselect-react-dropdown";
import { getData, getB2File } from "../../services/ensquare";
import "./CharacterList.scss";

function CharacterList() {
    const [listCharacters, setListCharacters] = useState([]);
    const [filterList, setFilterList] = useState([]);
    const [filterChoice, setFilterChoice] = useState([]);

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

    useEffect(() => {

    }, []);

    useEffect(() => {
        Promise.allSettled([
            getData("characters"),
            getData("unit_to_characters"),
            getData("units"),
        ])
            .then((data) => {
                let charactersWithUnits = data[1].value;
                if (filterList.length > 0) {
                    charactersWithUnits = charactersWithUnits.filter((character) => filterChoice.map((a) => a.id).includes(character.unit_id));
                }
                const characters = charactersWithUnits.map((charaUnit) => (
                    data[0].value.filter((chara) => chara.id === charaUnit.character_id)[0]
                ));
                const charactersElement = characters.map((character) => (
                    <Link to={`/characters/${character.id}`} className="es-characterList__character">
                        {/* <img src={getB2File(`icon/character_sd_square1_${character.id}.png`)} alt={character.first_name} /> */}
                        <img src={getB2File(`render/character_full1_${character.id}.png`)} alt={character.first_name} />
                        <div className="es-characterList__info">
                            <span>
                                {character.last_name}
                                {character.first_name}
                            </span>
                        </div>
                    </Link>
                ));
                setListCharacters(charactersElement);

                setFilterList(data[2].value);
            });
    }, []);

    return (
        <div>
            <Multiselect
                options={filterList} // Options to display in the dropdown
                // selectedValues={this.state.selectedValue} // Preselected value to persist in dropdown
                onSelect={unitFilter.onSelect} // Function will trigger on select event
                onRemove={unitFilter.onRemove} // Function will trigger on remove event
                displayValue="name"
            />
            <div className="es-characterList">{listCharacters}</div>
        </div>
    );
}

export default CharacterList;
