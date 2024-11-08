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
import { Locale, UserData } from "types/makotools";
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

function Page({ cardId, locale }: { cardId: string; locale: Locale }) {
  const router = useRouter();

  const { userDB } = useUser();

  const { t } = useTranslation("cards__card");

  const { data: cardData, isPending: isCardPending } = useQuery({
    queryKey: dataQueries.fetchCardData(cardId),
    enabled: !!cardId,
    queryFn: async () => {
      const cardsData = await getLocalizedDataArray<GameCard>("cards", locale);
      if (cardsData.status === "error")
        throw new Error("Could not retrieve card data");
      const cardData = getItemFromLocalizedDataArray(
        cardsData,
        parseInt(cardId)
      );
      if (cardData.status === "success") return cardData;
      else throw new Error("Could not retrieve card data");
    },
  });

  const card = cardData?.data;

  const { data: characterData, isPending: isCharacterPending } = useQuery({
    queryKey: [dataQueries.fetchCharacterData(card?.character_id)],
    enabled: !!card,
    queryFn: async () => {
      if (!card) throw new Error("No card data provided");
      const charactersData = await getLocalizedDataArray<GameCharacter>(
        "characters",
        locale,
        "character_id"
      );
      if (charactersData.status === "error")
        throw new Error("Could not retrieve character data");
      const characterData = getItemFromLocalizedDataArray(
        charactersData,
        card.character_id,
        "character_id"
      );
      if (characterData.status === "success") return characterData;
      else throw new Error("Could not retrieve character data");
    },
  });

  const { data: obtainMethodData, isPending: isObtainMethodPending } = useQuery(
    {
      queryKey: dataQueries.fetchCardObtainMethod(card?.id),
      enabled: !!card,
      queryFn: async () => {
        if (!card) throw new Error("No card data provided");

        const cardObtainId = card.obtain.id;

        if (cardObtainId) {
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
        }
      },
    }
  );

  if (!cardData || !characterData || !obtainMethodData || !card) {
    if (isCardPending || isCharacterPending || isObtainMethodPending) {
      return (
        <Center>
          <Loader />
        </Center>
      );
    } else {
      return <></>;
    }
  }

  const character = characterData.data;
  const obtainMethod = obtainMethodData.data;

  const [orderedTitle] = getTitleHierarchy(
    card?.title ?? [""],
    cardData?.lang,
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
      {obtainMethod && obtainMethod !== null && (
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

export async function getStaticPaths() {
  const cards = await getLocalizedDataArray<GameCard>("cards");
  const paths = cards.data?.map((card) => ({
    params: { id: String(card.id) },
  }));

  return { paths };
}

export async function getStaticProps({
  locale,
  params,
}: {
  locale: string;
  params: { id: string };
}) {
  const cardId = params.id;

  return {
    props: {
      cardId,
      locale,
    },
  };
}
