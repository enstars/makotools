import React from "react";
import {
  Group,
  AspectRatio,
  Badge,
  Divider,
  Text,
  Anchor,
} from "@mantine/core";
import { IconStar } from "@tabler/icons-react";
import useTranslation from "next-translate/useTranslation";
import getT from "next-translate/getT";
import Link from "next/link";
import { useRouter } from "next/router";

import Stats from "./components/Stats";
import Skills from "./components/Skills";
import Gallery from "./components/Gallery";
import HowToObtain from "./components/HowToObtain";

import { sumStats } from "services/game";
import { getLayout } from "components/Layout";
import PageTitle from "components/sections/PageTitle";
import attributes from "data/attributes.json";
import Reactions from "components/sections/Reactions";
import { getLocalizedNumber } from "components/utilities/formatting/CardStatsNumber";
import { Locale, QuerySuccess } from "types/makotools";
import Picture from "components/core/Picture";
import getServerSideUser from "services/firebase/getServerSideUser";
import {
  getItemFromLocalizedDataArray,
  getLocalizedDataArray,
} from "services/data";
import { getNameOrder } from "services/game";
import { getPreviewImageURL } from "services/makotools/preview";
import { GameCard, GameCharacter, Scout, Event } from "types/game";
import {
  centerSkillParse,
  liveSkillParse,
  supportSkillParse,
} from "services/skills";
import NameOrder from "components/utilities/formatting/NameOrder";
import { getTitleHierarchy } from "services/makotools/localization";
import useUser from "services/firebase/user";

function Page({
  characterQuery,
  cardQuery,
  obtainMethodQuery,
}: {
  characterQuery: QuerySuccess<GameCharacter>;
  cardQuery: QuerySuccess<GameCard>;
  obtainMethodQuery: QuerySuccess<Event | Scout | null>;
}) {
  const router = useRouter();
  const { data: card } = cardQuery;
  const { data: character } = characterQuery;
  const obtainMethod = obtainMethodQuery?.data;

  const { userDB } = useUser();

  const { t } = useTranslation("cards__card");

  const [orderedTitle] = getTitleHierarchy(
    card.title,
    cardQuery.lang,
    router.locale as Locale,
    userDB?.setting__game_region || "en"
  );

  return (
    <>
      <PageTitle title={orderedTitle[0]} />
      <Group mb="md" spacing="xs" align="center">
        <Text size="xl" weight={700} color="dimmed">
          {orderedTitle[1] && (
            <>
              {orderedTitle[1]}
              {" · "}
            </>
          )}
          <Anchor
            component={Link}
            href={`/characters/${character.character_id}`}
          >
            <NameOrder {...character} locale={characterQuery.lang[0].locale} />
          </Anchor>
        </Text>
        <Badge size="lg" color="yellow" sx={{ textTransform: "none" }}>
          {card.rarity}
          <IconStar size={13} strokeWidth={3} style={{ verticalAlign: -1 }} />
        </Badge>
        <Badge
          size="lg"
          color={attributes[card.type].color}
          sx={{ textTransform: "none" }}
        >
          {t(`${attributes[card.type].fullname}`)}
        </Badge>
        {card.obtain.type === "event" && (
          <Badge size="lg" sx={{ textTransform: "none" }}>
            {t("obtain.eventMethod")}
          </Badge>
        )}
        {card.obtain.type === "gacha" && (
          <Badge size="lg" sx={{ textTransform: "none" }}>
            {t("obtain.scoutMethod")}
          </Badge>
        )}
      </Group>

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

      <Reactions />
      <Stats card={card} />
      <Divider my="md" />
      <Skills card={card} />
      <Divider my="md" />
      {obtainMethod && obtainMethod !== null && (
        <HowToObtain card={card} obtainCampaign={obtainMethod} />
      )}
      <Divider my="md" />
      <Gallery card={card} />
    </>
  );
}

Page.getLayout = getLayout({});
export default Page;

export const getServerSideProps = getServerSideUser(
  async ({ locale, params, db }) => {
    const t = await getT("en", "skills");
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

    let obtainMethod = null;
    const cardObtainId = card.data.obtain.id;
    console.log("card obtain id: ", cardObtainId, typeof cardObtainId);

    if (cardObtainId) {
      if (card.data.obtain.type === "event") {
        const events = await getLocalizedDataArray<Event>(
          "events",
          locale,
          "event_id"
        );
        obtainMethod = getItemFromLocalizedDataArray<Event>(
          events,
          cardObtainId,
          "event_id"
        );
      } else if (card.data.obtain.type === "gacha") {
        const scouts = await getLocalizedDataArray<Scout>(
          "scouts",
          locale,
          "gacha_id"
        );
        obtainMethod = getItemFromLocalizedDataArray<Scout>(
          scouts,
          cardObtainId,
          "gacha_id"
        );
        console.log("obtain methoda: ", obtainMethod);
      }
    }

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
    const title = `(${
      card.data.title[0] || card.data.title[1]
    }) ${cardCharacterName}`;

    const breadcrumbs = ["cards", `${card.data.id}[ID]${title}`];
    const cardData = card.data;
    return {
      props: {
        characterQuery: character,
        cardQuery: card,
        obtainMethodQuery: obtainMethod,
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
              ? centerSkillParse(t, cardData.skills.center)
              : "",
            skill2desc: cardData?.skills?.live?.type_id
              ? liveSkillParse(t, cardData.skills.live, cardData.rarity)
              : "",
            skill3desc: cardData?.skills?.support?.type_id
              ? supportSkillParse(t, cardData.skills.support, cardData.rarity)
              : "",
          }),
          desc: `View ${title}'s stats, skills, and more on MakoTools!`,
        },
      },
    };
  }
);
