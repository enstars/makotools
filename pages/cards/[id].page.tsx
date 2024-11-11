import React from "react";
import {
  Group,
  AspectRatio,
  Badge,
  Divider,
  Text,
  Anchor,
  Center,
  Loader,
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
import { Locale, QuerySuccess, UserData } from "types/makotools";
import Picture from "components/core/Picture";
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
import { useQuery } from "@tanstack/react-query";
import { dataQueries } from "services/queries";
import { GetStaticPaths, GetStaticProps } from "next";

function Page({
  cardId,
  locale,
  cardQuery,
  characterQuery,
  obtainMethodQuery,
}: {
  cardId: string;
  locale: Locale;
  cardQuery: QuerySuccess<GameCard<string[]>>;
  characterQuery: QuerySuccess<GameCharacter<string[]>>;
  obtainMethodQuery: QuerySuccess<Event<string[]> | Scout<string[]>> | null;
}) {
  const router = useRouter();
  const { userDB } = useUser();
  const { t } = useTranslation("cards__card");

  const card = cardQuery.data;
  const character = characterQuery.data;
  const obtainMethod = obtainMethodQuery?.data ?? null;

  const [orderedTitle] = getTitleHierarchy(
    card?.title ?? [""],
    cardQuery?.lang,
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
            <NameOrder {...character} {...{ locale }} />
          </Anchor>
        </Text>
        <Badge size="lg" color="yellow" sx={{ textTransform: "none" }}>
          {card?.rarity}
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
      {obtainMethod && (
        <HowToObtain card={card} obtainCampaign={obtainMethod} />
      )}
      <Divider my="md" />
      <Gallery card={card} />
    </>
  );
}

// TODO: add meta to layout props
Page.getLayout = getLayout({});
export default Page;

export const getStaticPaths = (async () => {
  const cards = await getLocalizedDataArray<GameCard>("cards");
  if (cards.status === "error") throw new Error("Could not retrieve card data");
  const paths = cards.data.map((card) => ({
    params: { id: String(card.id) },
  }));

  return {
    paths,
    fallback: "blocking",
  };
}) satisfies GetStaticPaths;

export const getStaticProps = (async ({
  locale,
  params,
}: {
  locale: Locale;
  params: { id: string };
}) => {
  const cardId = params.id;

  const cardsQuery = await getLocalizedDataArray<GameCard>("cards", locale);
  if (cardsQuery.status === "error")
    throw new Error("Could not retrieve card data");
  const cardQuery = getItemFromLocalizedDataArray(cardsQuery, parseInt(cardId));
  if (cardQuery.status === "error")
    throw new Error("Could not retrieve card data");

  const { data: card } = cardQuery;

  const charactersQuery = await getLocalizedDataArray<GameCharacter>(
    "characters",
    locale,
    "character_id"
  );
  if (charactersQuery.status === "error")
    throw new Error("Could not retrieve character data");
  const characterQuery = getItemFromLocalizedDataArray(
    charactersQuery,
    card.character_id,
    "character_id"
  );

  if (characterQuery.status === "error")
    throw new Error("Could not retrieve character data");
  if (!card) throw new Error("No card data provided");

  const cardObtainId = card.obtain.id;
  const getObtain = async () => {
    if (!cardObtainId) return null;
    if (card.obtain.type === "event") {
      const events = await getLocalizedDataArray<Event>(
        "events",
        locale,
        "event_id"
      );
      return getItemFromLocalizedDataArray<Event>(
        events,
        cardObtainId,
        "event_id"
      );
    } else if (card.obtain.type === "gacha") {
      const scouts = await getLocalizedDataArray<Scout>(
        "scouts",
        locale,
        "gacha_id"
      );
      return getItemFromLocalizedDataArray<Scout>(
        scouts,
        cardObtainId,
        "gacha_id"
      );
    }
  };
  const obtainMethodQuery = await getObtain();

  return {
    props: {
      cardId,
      locale,
      cardQuery,
      characterQuery,
      obtainMethodQuery,
    },
  };
}) satisfies GetStaticProps<{ cardId: string; locale: Locale }>;
