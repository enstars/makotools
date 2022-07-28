import React from "react";
import {
  getB2File,
  getLocalizedData,
  getPreviewImageURL,
} from "../../services/ensquare";
import Layout from "../../components/Layout";
import PageTitle from "../../components/PageTitle";
import Head from "next/head";
import ImageViewer from "../../components/core/ImageViewer";
import { Group, AspectRatio, Badge, Title, Table } from "@mantine/core";
import { IconStar } from "@tabler/icons";
import attributes from "../../data/attributes.json";
import Reactions from "../../components/core/Reactions";
import Stats, { sumStats } from "./Card/Stats";
import NameOrder, { getNameOrder } from "../../components/core/NameOrder";
import {
  withAuthUser,
  AuthAction,
  withAuthUserTokenSSR,
  getFirebaseAdmin,
} from "next-firebase-auth";
import getServerSideUser from "../../services/firebase/getServerSideUser";
import { getLocalizedNumber } from "../../components/core/CardStatsNumber";

function Page({ character, card, title }) {
  console.log(card);
  // const { id } = useParams();
  // const router = useRouter();
  // const { id } = router.query;
  // const card = cards.main.data[i];
  const cardLocalizedMain = card.mainLang;
  // const character = characters.main.data[characterID];
  const characterLocalizedMain = character.mainLang;
  // console.log(cardsJP);

  return (
    <>
      <PageTitle
        title={
          <>
            ({cardLocalizedMain.title}){" "}
            <NameOrder
              last={characterLocalizedMain.last_name}
              first={characterLocalizedMain.first_name}
            />
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
      ></PageTitle>

      <Group>
        {["normal", "evolution"].map((type) => (
          <AspectRatio
            ratio={4 / 5}
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
      <Stats card={card} />
      <Reactions />
    </>
  );
}

export default Page;

export const getServerSideProps = getServerSideUser(
  async ({ req, res, locale, params, user, firestore }) => {
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

    const title = `(${card.mainLang.title}) ${getNameOrder(
      character.mainLang,
      firestore.name_order,
      locale
    )}`;

    // const breadcrumbs = req.url.split("/").filter((e) => e);
    // breadcrumbs[breadcrumbs.length - 1] = title;
    // -> this doesnt work very well, see:
    //    https://github.com/vercel/next.js/discussions/15787

    // getLocalizedNumber
    const breadcrumbs = ["cards", title];
    return {
      props: {
        character,
        card,
        title,
        breadcrumbs,
        meta: {
          title,
          img: getPreviewImageURL("card", {
            title: card.mainLang.title,
            name: getNameOrder(
              character.mainLang,
              firestore.name_order,
              locale
            ),
            image1: `card_rectangle4_${cardID}_normal.png`,
            image2: `card_rectangle4_${cardID}_evolution.png`,
            stats1: getLocalizedNumber(
              sumStats(card.main.stats.ir, "???"),
              locale,
              false
            ),
            stats2: getLocalizedNumber(
              sumStats(card.main.stats.ir2, "???"),
              locale,
              false
            ),
            stats3: getLocalizedNumber(
              sumStats(card.main.stats.ir4, "???"),
              locale,
              false
            ),
            path: `/cards/${cardID}`,
          }),
          desc: `View ${card.mainLang.title}'s stats, skills, and more!`,
        },
      },
    };
  }
);

Page.getLayout = function getLayout(page, pageProps) {
  return <Layout pageProps={pageProps}>{page}</Layout>;
};
