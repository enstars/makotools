import React from "react";
import { Group, AspectRatio, Badge, Divider } from "@mantine/core";
import { IconStar } from "@tabler/icons";

import Stats, { sumStats } from "./components/Stats";
import Skills from "./components/Skills";
import Gallery from "./components/Gallery";

import { getLayout } from "components/Layout";
import PageTitle from "components/sections/PageTitle";
import attributes from "data/attributes.json";
import Reactions from "components/sections/Reactions";
import NameOrder from "components/utilities/formatting/NameOrder";
import { getLocalizedNumber } from "components/utilities/formatting/CardStatsNumber";
import { QuerySuccess } from "types/makotools";
import Picture from "components/core/Picture";
import getServerSideUser from "services/firebase/getServerSideUser";
import {
  getItemFromLocalizedDataArray,
  getLocalizedDataArray,
} from "services/data";
import { getNameOrder } from "services/game";
import { getPreviewImageURL } from "services/makotools/preview";
import { GameCard, GameCharacter } from "types/game";
import {
  centerSkillParse,
  liveSkillParse,
  supportSkillParse,
} from "services/skills";

function Page({
  characterQuery,
  cardQuery,
}: {
  characterQuery: QuerySuccess<GameCharacter>;
  cardQuery: QuerySuccess<GameCard>;
}) {
  const { data: card } = cardQuery;
  const { data: character } = characterQuery;

  return (
    <>
      <PageTitle
        title={
          <>
            ({card.title[0]}){" "}
            <NameOrder {...character} locale={characterQuery.lang[0].locale} />
            <Group mt="sm" spacing="xs">
              <Badge size="xl" color="yellow" sx={{ textTransform: "none" }}>
                {card.rarity}
                <IconStar
                  size={13}
                  strokeWidth={3}
                  style={{ verticalAlign: -1 }}
                />
              </Badge>
              <Badge
                size="xl"
                color={attributes[card.type].color}
                sx={{ textTransform: "none" }}
              >
                {attributes[card.type].fullname}
              </Badge>
            </Group>
          </>
        }
      />

      <Group>
        {["normal", "evolution"].map((type) => (
          <AspectRatio
            ratio={4 / 5}
            key={type}
            sx={{ minHeight: 10, flexGrow: 1 }}
          >
            <Picture
              radius="md"
              alt={card.title[0]}
              srcB2={`assets/card_rectangle4_${card.id}_${type}.png`}
              action="view"
            />
          </AspectRatio>
        ))}
      </Group>
      <Stats card={card} />
      <Divider my="md" />
      <Skills card={card} />
      <Divider my="md" />
      <Gallery card={card} />
      <Reactions />
    </>
  );
}

Page.getLayout = getLayout({});
export default Page;

export const getServerSideProps = getServerSideUser(
  async ({ locale, params, db }) => {
    const characters = await getLocalizedDataArray<GameCharacter>(
      "characters",
      locale,
      "character_id"
    );
    const cards = await getLocalizedDataArray<GameCard>("cards", locale);

    if (
      !params?.id ||
      typeof params.id !== "string" ||
      cards.status === "error" ||
      characters.status === "error"
    ) {
      return {
        notFound: true,
      };
    }
    const lastURLSegment = params.id.toLocaleLowerCase();
    const cardID = parseInt(lastURLSegment, 10);

    const card = getItemFromLocalizedDataArray<GameCard>(cards, cardID);

    if (card.status === "error") {
      return {
        notFound: true,
      };
    }

    const cardCharacterId = card.data.character_id;

    const character = getItemFromLocalizedDataArray<GameCharacter>(
      characters,
      cardCharacterId,
      "character_id"
    );

    if (character.status === "error") {
      return {
        notFound: true,
      };
    }

    const cardCharacterName = getNameOrder(
      character.data,
      db?.setting__name_order,
      locale
    );
    const title = `(${card.data.title[0]}) ${cardCharacterName}`;

    const breadcrumbs = ["cards", title];
    const cardData = card.data;
    return {
      props: {
        characterQuery: character,
        cardQuery: card,
        title,
        breadcrumbs,
        meta: {
          title,
          img: getPreviewImageURL("card", {
            title: card.data.title[0],
            name: cardCharacterName,
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
              ? liveSkillParse(cardData.skills.live, cardData.rarity)
              : "",
            skill3desc: cardData?.skills?.support?.type_id
              ? supportSkillParse(cardData.skills.support, cardData.rarity)
              : "",
          }),
          desc: `View ${title}'s stats, skills, and more on MakoTools!`,
        },
      },
    };
  }
);
