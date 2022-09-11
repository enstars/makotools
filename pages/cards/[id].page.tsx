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
  getItemFromLocalized,
  getLocalizedData,
  getNameOrder,
  getPreviewImageURL,
} from "../../services/ensquare";
import { getLayout } from "../../components/Layout";
import PageTitle from "../../components/sections/PageTitle";
import ImageViewer from "../../components/core/ImageViewer";
import attributes from "../../data/attributes.json";
import Reactions from "../../components/sections/Reactions";
import NameOrder from "../../components/utilities/formatting/NameOrder";
import getServerSideUser from "../../services/firebase/getServerSideUser";
import { getLocalizedNumber } from "../../components/utilities/formatting/CardStatsNumber";
import { LoadedData, LoadedDataLocalized } from "../../types/makotools";
import Picture from "../../components/core/Picture";

import Stats, { sumStats } from "./components/Stats";
import Skills, {
  centerSkillParse,
  liveSkillParse,
  supportSkillParse,
} from "./components/Skills";

function Page({
  character,
  card,
}: {
  character: LoadedData<GameCharacter>;
  card: LoadedData<GameCard>;
}) {
  console.log(character);
  console.log(card);
  // const { id } = useParams();
  // const router = useRouter();
  // const { id } = router.query;
  const cardMain = card.main.data;
  const cardLocalizedMain = card.mainLang.data;
  // const character = characters.main.data[characterID];
  const characterLocalizedMain = character.mainLang.data;
  // console.log(cardsJP);

  return (
    <>
      <PageTitle
        title={
          <>
            ({cardLocalizedMain.title}){" "}
            <NameOrder {...characterLocalizedMain} />
            <Group mt="sm" spacing="xs">
              <Badge size="xl" color="yellow" sx={{ textTransform: "none" }}>
                {cardMain.rarity}
                <IconStar
                  size={13}
                  strokeWidth={3}
                  style={{ verticalAlign: -1 }}
                />
              </Badge>
              <Badge
                size="xl"
                color={attributes[cardMain.type].color}
                sx={{ textTransform: "none" }}
              >
                {attributes[cardMain.type].fullname}
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
            <Picture
              radius="md"
              alt={cardMain.title}
              withPlaceholder
              srcB2={`assets/card_rectangle4_${cardMain.id}_${type}.png`}
              action="view"
            ></Picture>
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
  async ({ locale, params, firestore }) => {
    const characters = await getLocalizedData<GameCharacter[]>(
      "characters",
      locale
    );
    const cards = await getLocalizedData<GameCard[]>("cards", locale);

    if (!params?.id || typeof params.id !== "string" || !cards || !characters) {
      return {
        notFound: true,
      };
    }
    const lastURLSegment = params.id.toLocaleLowerCase();
    const cardID = parseInt(lastURLSegment, 10);

    const card = getItemFromLocalized<GameCard>(cards, cardID);

    if (
      typeof card.mainLang.data === "undefined" &&
      card.subLang.status === "success" &&
      typeof card.subLang.data !== "undefined"
    ) {
      const prevMainLang = card.mainLang;
      card.mainLang = card.subLang;
      card.subLang = prevMainLang;
    }

    if (
      typeof card.main.data === "undefined" ||
      typeof card.mainLang.data === "undefined"
    ) {
      return {
        notFound: true,
      };
    }

    const cardCharacterId = card.main.data.character_id;

    const character = getItemFromLocalized(
      characters,
      cardCharacterId,
      "character_id"
    );

    if (
      typeof character.main.data === "undefined" ||
      typeof character.mainLang.data === "undefined"
    ) {
      return {
        notFound: true,
      };
    }

    const title = `(${card.mainLang.data?.title}) ${getNameOrder(
      character.mainLang.data,
      firestore?.setting__name_order,
      locale
    )}`;

    // const breadcrumbs = req.url.split("/").filter((e) => e);
    // breadcrumbs[breadcrumbs.length - 1] = title;
    // -> this doesnt work very well, see:
    //    https://github.com/vercel/next.js/discussions/15787

    // getLocalizedNumber
    const breadcrumbs = ["cards", title];
    const cardData = card.main.data;
    return {
      props: {
        character,
        card,
        title,
        breadcrumbs,
        meta: {
          title,
          img: getPreviewImageURL("card", {
            title: card.mainLang.data.title,
            name: getNameOrder(
              character.mainLang.data,
              firestore?.setting__name_order,
              locale
            ),
            image1: `card_rectangle4_${cardID}_normal.png`,
            image2: `card_rectangle4_${cardID}_evolution.png`,
            stats1: getLocalizedNumber(
              sumStats(cardData.stats?.ir, "???"),
              locale,
              false
            ),
            stats2: getLocalizedNumber(
              sumStats(cardData.stats?.ir2, "???"),
              locale,
              false
            ),
            stats3: getLocalizedNumber(
              sumStats(cardData.stats?.ir4, "???"),
              locale,
              false
            ),
            path: `/cards/${cardID}`,
            skill1desc: cardData?.skills?.center?.type_id
              ? centerSkillParse(cardData.skills.center)
              : "",
            skill2desc: cardData?.skills?.live?.type_id
              ? liveSkillParse(cardData.skills.live)
              : "",
            skill3desc: cardData?.skills?.support?.type_id
              ? supportSkillParse(cardData.skills.support)
              : "",
          }),
          desc: `View ${card.mainLang.data.title}'s stats, skills, and more!`,
        },
      },
    };
  }
);
