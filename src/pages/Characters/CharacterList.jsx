import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getData, getB2File } from "../../services/ensquare";
import "./CharacterList.scss";

function CharacterList() {
    const [listCharacters, setListCharacters] = useState([]);

    useEffect(() => {
        getData("characters").then((data) => {
            const characters = data.map((character) => (
                <Link to={`/characters/${character.id}`} className="es-characterList__character">
                    <img src={getB2File(`icon/character_sd_square1_${character.id}.png`)} alt={character.first_name} />
                    <span>
                        {character.last_name}
                        {character.first_name}
                    </span>
                </Link>
            ));
            setListCharacters(characters);
        });
    }, []);

    return (
        <div>
            {/* <p>List</p> */}
            <div className="es-characterList">{listCharacters}</div>
        </div>
    );
}

export default CharacterList;
