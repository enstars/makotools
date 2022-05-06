import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getData, getB2File, getLocalizedData } from "../../services/ensquare";
import Layout from "../../components/Layout";
import Title from "../../components/Title";
import Head from "next/head";
import ImageViewer from "../../components/core/ImageViewer";
import { Text } from "@mantine/core";

function Character({ characters, i }) {
  // const { id } = useParams();
  const router = useRouter();
  const { id } = router.query;
  console.log(characters);

  return (
    <>
      <Head>
        <title>{`${characters[0][i].first_name} ${characters[0][i].last_name} - EnSquare`}</title>
        <meta name="description" content={characters[0][i].introduction} />
      </Head>

      <Title
        title={
          <>
            <ruby>
              {characters[0][i].first_name}
              {characters[0][i].first_nameRuby && (
                <>
                  <rp> (</rp>
                  <Text component="rt">{characters[0][i].first_nameRuby}</Text>
                  <rp>)</rp>
                </>
              )}
            </ruby>{" "}
            <ruby>
              {characters[0][i].last_name}

              {characters[0][i].last_nameRuby && (
                <>
                  <rp> (</rp>
                  <Text component="rt">{characters[0][i].last_nameRuby}</Text>
                  <rp>)</rp>
                </>
              )}
            </ruby>
          </>
        }
      ></Title>
      <Text>{characters[0][i].introduction}</Text>
      <div className="content-text">
        <ImageViewer
          src={getB2File(
            `render/character_full1_${characters[0][i].character_id}.png`
          )}
          alt={characters[0][i].first_name}
          width={300}
          height={300}
        />
        <ul>
          <li>Birthday: {characters[0][i].birthday}</li>
          <li>Age: {characters[0][i].age}</li>
        </ul>
      </div>
    </>
  );
}

export default Character;

export async function getServerSideProps({ req, res, locale }) {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=7200, stale-while-revalidate=172800"
  );
  // refresh every 2 hours, stale for 48hrs
  // console.log(locale);
  const characters = await getLocalizedData("characters", locale);
  const charactersEN = await getData("characters", "en");
  const urlSegments = req.url.split("/");
  const lastSegment = decodeURIComponent(urlSegments[urlSegments.length - 1])
    .toLocaleLowerCase()
    .trim();
  const characterID = parseInt(lastSegment, 10);
  const isName = isNaN(characterID);
  // console.log(lastSegment);
  const characterIndex = charactersEN.indexOf(
    charactersEN.find(
      isName
        ? (item) =>
            `${item.last_name} ${item.first_name}`.toLocaleLowerCase() ===
              lastSegment ||
            `${item.first_name} ${item.last_name}`.toLocaleLowerCase() ===
              lastSegment ||
            `${item.first_name}`.toLocaleLowerCase() === lastSegment
        : (item) => item.character_id === characterID
    )
  );

  // console.log(charactersEN);
  return {
    props: { characters, i: characterIndex },
  };
}

Character.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
