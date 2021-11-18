import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { useQuery } from "react-query";
import { getData, getB2File } from "../../services/ensquare";

function Character() {
    // const { id } = useParams();
    const router = useRouter();
    const { id } = router.query;
    const [viewCharacter, setViewCharacter] = useState();
    const { data: characters } = useQuery(["characters"], () =>
        getData("characters"),
    );

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
            <Image
                style={{ float: "right", width: "400px" }}
                src={getB2File(
                    `render/character_full1_${viewCharacter.id}.png`,
                )}
                alt={viewCharacter.first_name}
                width="400"
                height="600"
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
                <li>Birthday: {viewCharacter.birthday}</li>
                <li>Age: {viewCharacter.age}</li>
            </ul>
        </div>
    );
}

export default Character;
