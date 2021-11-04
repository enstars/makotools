import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getData, getB2File } from "../../services/ensquare";
import "./CharacterList.scss";

function Character() {
    // const [listCharacters, setListCharacters] = useState([]);
    const { id } = useParams();

    const [viewCharacter, setViewCharacter] = useState([]);

    useEffect(() => {
        getData("characters").then((characters) => {
            const character = characters.filter((item) => item.id === parseInt(id, 10))[0];
            // console.log(characters);
            // console.log(character);
            setViewCharacter(
                <>
                    <img style={{ float: "right", width: "400px" }} src={getB2File(`render/character_full1_${character.id}.png`)} alt={character.first_name} />

                    <h1>
                        <ruby>
                            {character.last_name}
                            <rp> (</rp>
                            <rt>{character.last_nameRuby}</rt>
                            <rp>)</rp>
                        </ruby>
                        <ruby>
                            {character.first_name}
                            <rp> (</rp>
                            <rt>{character.first_nameRuby}</rt>
                            <rp>)</rp>
                        </ruby>
                    </h1>
                    <ul>
                        <li>
                            Birthday:
                            {" "}
                            {character.birthday}
                        </li>
                        <li>
                            Age:
                            {" "}
                            {character.age}
                        </li>
                    </ul>
                </>,

            );
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="content-text">
            {viewCharacter}
        </div>
    );
}

export default Character;
