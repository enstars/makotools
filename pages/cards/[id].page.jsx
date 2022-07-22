import React from "react";
import { getB2File, getLocalizedData } from "../../services/ensquare";
import Layout from "../../components/Layout";
import Title from "../../components/PageTitle";
import Head from "next/head";
import ImageViewer from "../../components/core/ImageViewer";
import { Group, AspectRatio, Badge } from "@mantine/core";
import { IconStar } from "@tabler/icons";
import attributes from "../../data/attributes.json";
import Reactions from "../../components/core/Reactions";

function Character({ character, card }) {
  console.log(card);
  // const { id } = useParams();
  // const router = useRouter();
  // const { id } = router.query;
  // const card = cards.main.data[i];
  const cardLocalizedMain = card.mainLang;
  // const character = characters.main.data[characterID];
  const characterLocalizedMain = character.mainLang;
  // console.log(cardsJP);

  const getBreadcrumbs = (path) => {
    const pathNames = path.split("/");
    pathNames[
      pathNames.length - 1
    ] = `(${cardLocalizedMain.title}) ${characterLocalizedMain.last_name} ${characterLocalizedMain.first_name}`;
    return pathNames.filter((x) => x);
  };

  return (
    <>
      <Head>
        {/* <title>{`${character.first_name} ${character.last_name} - EnSquare`}</title> */}
        {/* <meta name="description" content={character.introduction} /> */}
      </Head>
      <Title
        title={
          <>
            ({cardLocalizedMain.title}) {characterLocalizedMain.last_name}{" "}
            {characterLocalizedMain.first_name}
            <Group mt="sm" spacing="xs">
              <Badge size="xl" color="yellow" sx={{ textTransform: "none" }}>
                {card.main.rarity}
                <IconStar
                  size={13}
                  strokeWidth={3}
                  style={{ verticalAlign: -1 }}
                />
              </Badge>
              <Badge
                size="xl"
                color={attributes[card.main.type].color}
                sx={{ textTransform: "none" }}
              >
                {attributes[card.main.type].fullname}
              </Badge>
            </Group>
            {/* <Paper
              component={Box}
              sx={{
                position: "absolute",
                bottom: -2,
                right: -12.5,
                borderTopLeftRadius: theme.radius.sm,
                transform: "skew(-15deg)",
                pointerEvents: "none",
                borderBottom: `solid 2px ${
                  characters.find((c) => c.character_id === card.character_id)
                    .image_color
                }`,
              }}
              pl={10}
              pr={20}
              py={2}
              radius={0}
            >
              <Text
                size="xs"
                weight="700"
                sx={{
                  transform: "skew(15deg)",
                }}
              >{`${cardMainLang?.name?.split(" ")?.[0]}`}</Text>
            </Paper> */}
          </>
        }
        getBreadcrumbs={getBreadcrumbs}
      ></Title>

      <Reactions />
      <Group>
        {["normal", "evolution"].map((type) => (
          <AspectRatio
            ratio={3 / 4}
            key={type}
            sx={{ minHeight: 10, flexGrow: 1 }}
          >
            <ImageViewer
              radius="md"
              alt={card.main.title}
              withPlaceholder
              src={getB2File(
                `assets/card_rectangle4_${card.main.id}_${type}.png`
              )}
            ></ImageViewer>
          </AspectRatio>
        ))}
      </Group>
    </>
  );
}

export default Character;

export async function getServerSideProps({ res, locale, params }) {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=7200, stale-while-revalidate=172800"
  );
  // refresh every 2 hours, stale for 48hrs

  const cards = await getLocalizedData("cards", locale);
  const characters = await getLocalizedData("characters", locale);
  // const { data: cardsJP } = await getData("cards", "ja");
  const lastURLSegment = params.id.toLocaleLowerCase();
  const cardID = parseInt(lastURLSegment, 10);
  const cardIndex = cards.main.data.indexOf(
    cards.main.data.find(
      isNaN(cardID)
        ? (item) => item.title.toLocaleLowerCase() === lastURLSegment
        : (item) => item.id === cardID
    )
  );

  if (cardIndex === -1) {
    return {
      notFound: true,
    };
  }

  const characterIndex = characters.main.data.indexOf(
    characters.main.data.find(
      (c) =>
        c.character_id ===
        cards.main.data.find((c) => c.id === cardID).character_id
    )
  );

  const character = {
    main: characters.main.data[characterIndex],
    mainLang: characters.mainLang.data[characterIndex],
    subLang: characters.subLang.data[characterIndex],
  };
  const card = {
    main: cards.main.data[cardIndex],
    mainLang: cards.mainLang.data[cardIndex],
    subLang: cards.subLang.data[cardIndex],
  };

  return {
    props: { character, card },
  };
}

Character.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
