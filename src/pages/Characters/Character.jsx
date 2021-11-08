import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { getData, getB2File } from "../../services/ensquare";
import "./CharacterList.scss";

function Character() {
    const { id } = useParams();
    const [viewCharacter, setViewCharacter] = useState();
    const { data: characters } = useQuery(["characters"], () => getData("characters"));

    useEffect(() => {
        window.scrollTo(0, 0);
        if (characters) {
            const character = characters.find(
                (item) => item.id === parseInt(id, 10),
            );
            setViewCharacter(character);
        }
    }, [characters, id]);

    if (!viewCharacter) {
        return null;
    }

    return (
        <div className="content-text">
            <img
                style={{ float: "right", width: "400px" }}
                src={getB2File(
                    `render/character_full1_${viewCharacter.id}.png`,
                )}
                alt={viewCharacter.first_name}
            />

            <h1>
                <ruby>
                    {viewCharacter.name}
                    <rp> (</rp>
                    <rt>{viewCharacter.kana_name}</rt>
                    <rp>)</rp>
                </ruby>
            </h1>
            <ul>
                <li>
                    Birthday:
                    {" "}
                    {viewCharacter.birthday}
                </li>
                <li>
                    Age:
                    {" "}
                    {viewCharacter.age}
                </li>
            </ul>
        </div>
    );
}

export default Character;
