import React from "react";
import Head from "next/head";
import {
  Group,
  AspectRatio,
  Badge,
  Title,
  Table,
  Divider,
} from "@mantine/core";
import { IconStar } from "@tabler/icons";
import {
  withAuthUser,
  AuthAction,
  withAuthUserTokenSSR,
  getFirebaseAdmin,
} from "next-firebase-auth";

import {
  getB2File,
  getLocalizedData,
  getPreviewImageURL,
} from "../../services/ensquare";
import { getLayout } from "../../components/Layout";
import PageTitle from "../../components/sections/PageTitle";
import ImageViewer from "../../components/core/ImageViewer";
import attributes from "../../data/attributes.json";
import Reactions from "../../components/sections/Reactions";
import NameOrder, {
  getNameOrder,
} from "../../components/utilities/formatting/NameOrder";
import getServerSideUser from "../../services/firebase/getServerSideUser";
import { getLocalizedNumber } from "../../components/utilities/formatting/CardStatsNumber";

import Stats, { sumStats } from "./components/Stats";
import Skills from "./components/Skills";

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
      <Divider />
      <Skills card={card} />
      <Reactions />
    </>
  );
}

Page.getLayout = getLayout({
  // hideSidebar: true,
});
export default Page;

export const getServerSideProps = getServerSideUser(
  async ({ req, res, locale, params, user, firestore }) => {
    const cards = await getLocalizedData("cards", locale);
    const characters = await getLocalizedData("characters", locale);
    // const { data: cardsJP } = await getData("cards", "ja");
    const lastURLSegment = params.id.toLocaleLowerCase();
    const cardID = parseInt(lastURLSegment, 10);

    const findCardFunction = isNaN(cardID)
      ? (item) => item.title.toLocaleLowerCase() === lastURLSegment
      : (item) => item.id === cardID;

    const cardIndex = cards.main.data.indexOf(
      cards.main.data.find(findCardFunction)
    );

    if (cardIndex === -1) {
      return {
        notFound: true,
      };
    }

    const findCharacterFunction = (c) =>
      c.character_id ===
      cards.main.data.find((c) => c.id === cardID).character_id;

    const character = {
      main: characters.main.data.find(findCharacterFunction),
      mainLang: characters.mainLang.data.find(findCharacterFunction),
      subLang: characters.subLang.data.find(findCharacterFunction),
    };
    const card = {
      main: cards.main.data.find(findCardFunction),
      mainLang: cards.mainLang.data.find(findCardFunction),
      subLang: cards.subLang.data.find(findCardFunction),
    };

    const title = `(${card.mainLang.title}) ${getNameOrder(
      character.mainLang,
      firestore?.name_order,
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
              firestore?.name_order,
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
