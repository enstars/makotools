import { Box, useMantineTheme, Text, Group, Accordion } from "@mantine/core";
import { IconCards, IconStar, IconStarFilled } from "@tabler/icons-react";
import { useState } from "react";

import { useCharacterColors } from "../[id].page";

import SectionTitle from "pages/events/components/SectionTitle";
import { Lang } from "types/makotools";
import { GameCard, GameCharacter } from "types/game";
import { CardCard } from "components/core/CardCard";
import { useCollections } from "services/makotools/collection";
import ResponsiveGrid from "components/core/ResponsiveGrid";
import useUser from "services/firebase/user";

export function CardsSection({
  cards,
  character,
  lang,
}: {
  cards: GameCard[];
  character: GameCharacter;
  lang: Lang[];
}) {
  const user = useUser();
  const theme = useMantineTheme();
  const { collections, onEditCollection, onNewCollection } = useCollections();
  const [newCollectionModalOpened, setNewCollectionModalOpened] =
    useState<boolean>(false);

  // const textColor = isColorLight(character.image_color as string)
  //   ? primaryCharaColor(theme, character.image_color)
  //   : secondaryCharaColor(theme, character.image_color);
  // const bgColor = isColorLight(character.image_color as string)
  //   ? secondaryCharaColor(theme, character.image_color)
  //   : primaryCharaColor(theme, character.image_color);

  const colors = useCharacterColors();

  return (
    <Box id="cards">
      <SectionTitle
        id="cards"
        title="Cards"
        Icon={IconCards}
        iconProps={{ color: colors.image }}
      />
      <Accordion
        variant="separated"
        defaultValue="5"
        styles={{
          chevron: {
            "& svg": {
              width: 20,
              height: 20,
            },
          },
        }}
      >
        {[5, 4, 3, 2, 1].map((rarity) => {
          const rarityCards = cards.filter((card) => card.rarity === rarity);

          return (
            rarityCards.length > 0 && (
              <Accordion.Item
                value={rarity.toString()}
                sx={{
                  borderRadius: theme.radius.md,
                  border: "none",
                  // boxShadow: theme.shadows.xs,
                  overflow: "hidden",
                  transition: "transform 250ms ease",
                  "&+&": {
                    marginTop: theme.spacing.xs,
                  },
                  "&[data-active]": {
                    // boxShadow: theme.shadows.md,
                    // transform: "scale(1.02)",
                  },
                }}
              >
                <Accordion.Control
                  sx={{
                    paddingTop: theme.spacing.xs,
                    paddingBottom: theme.spacing.xs,
                    overflow: "hidden",
                    position: "relative",
                    background: colors.secondary,
                    color: colors.primary,
                    // "&[data-active]": {
                    //   // backgroundColor: colors.secondary,
                    //   // color: colors.primary,
                    // },
                  }}
                >
                  <Group spacing="xs">
                    <Text size="lg" weight={700}>
                      {rarity}
                    </Text>
                    <IconStarFilled size="1rem" />
                  </Group>
                  <Group
                    sx={{
                      position: "absolute",
                      right: theme.spacing.sm,
                      bottom: -theme.spacing.xs * 1.5,
                      transform: "skew(-15deg)",
                      "& svg.deco-star": {
                        color: colors.primary,
                        opacity: 0.1,
                      },
                    }}
                    spacing={0}
                  >
                    {new Array(rarity).fill(0).map((_, i) => (
                      <IconStar
                        className="deco-star"
                        strokeWidth={1.5}
                        key={i}
                        size="3.5rem"
                      />
                    ))}
                  </Group>
                </Accordion.Control>

                <Accordion.Panel
                  sx={{
                    backgroundColor: `${character.image_color}11`,
                  }}
                >
                  <ResponsiveGrid>
                    {rarityCards.map((card) => (
                      <CardCard
                        key={card.id}
                        card={card}
                        cardOptions={{ showFullInfo: true }}
                        collections={collections}
                        lang={lang}
                        onEditCollection={onEditCollection}
                        onNewCollection={() =>
                          setNewCollectionModalOpened(true)
                        }
                        character={character}
                        gameRegion={
                          (user.loggedIn && user.db.setting__game_region) ||
                          "en"
                        }
                      />
                    ))}
                  </ResponsiveGrid>
                </Accordion.Panel>
              </Accordion.Item>
            )
          );
        })}
      </Accordion>
    </Box>
  );
}
