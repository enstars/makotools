import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { useQuery } from "react-query";
import { getData, getB2File } from "../../services/ensquare";
import Layout from "../../components/Layout";
import Title from "../../components/Title";

function Character() {
  // const { id } = useParams();
  const router = useRouter();
  const { id } = router.query;
  const [viewCharacter, setViewCharacter] = useState();
  const { data: characters } = useQuery(["characters"], () =>
    getData("characters")
  );

  useEffect(() => {
    window.scrollTo(0, 0);
    if (characters) {
      const character = characters.find(
        (item) => item.character_id === parseInt(id, 10)
      );
      setViewCharacter(character);
    }
  }, [characters, id]);

  if (!viewCharacter) {
    return null;
  }

  return (
    <>
      <Title
        title={`${viewCharacter.first_name} ${viewCharacter.last_name}`}
      ></Title>
      <div className="content-text">
        <h1>
          <ruby>
            {viewCharacter.first_name}
            <rp> (</rp>
            <rt>{viewCharacter.last_nameRuby}</rt>
            <rp>)</rp>
          </ruby>
          <ruby>
            {viewCharacter.last_name}
            <rp> (</rp>
            <rt>{viewCharacter.last_nameRuby__1}</rt>
            <rp>)</rp>
          </ruby>
        </h1>

        <Image
          src={getB2File(
            `render/character_full1_${viewCharacter.character_id}.png`
          )}
          alt={viewCharacter.first_name}
          layout="responsive"
          width="600"
          height="600"
        />
        <ul>
          <li>Birthday: {viewCharacter.birthday}</li>
          <li>Age: {viewCharacter.age}</li>
        </ul>
      </div>
    </>
  );
}

export default Character;

Character.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
