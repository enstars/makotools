import React from "react";
import Link from "next/link";
import { Box, Card, createStyles, Title } from "@mantine/core";

import { twoStarIDs } from "data/characterIDtoCardID";

import { getAssetURL } from "services/data";
import NameOrder from "components/utilities/formatting/NameOrder";
import { Lang } from "types/makotools";
import Picture from "components/core/Picture";
import { GameCharacter } from "types/game";

const useStyles = createStyles((theme, params: any, getRef) => ({
  card: {
    ref: getRef("card"),
    height: 180,
    display: "flex",
    justifyContent: "center",
    [`&:hover .${getRef("background")}`]: {
      backgroundPosition: "right",
    },
    [`&:hover .${getRef("picture")}`]: {
      flexBasis: 600,
      height: 200,
    },
    [`&:hover .${getRef("pictureBloomed")}`]: {
      display: "block",
    },
  },
  background: {
    ref: getRef("background"),
    position: "absolute",
    width: "100%",
    height: "100%",
    left: 0,
    top: 0,
    background: `left / 250% 100% no-repeat
    linear-gradient(
      -45deg,
      ${params.color} 30%,
      ${params.color}33 30%,
      ${params.color}33 50%,
      transparent 50%
    )`,
    transition: theme.other.transition,
  },
  pictureWrapper: {
    ref: getRef("picture"),
    flexBasis: 400,
    height: 180,
    position: "relative",
    flexShrink: 0,
    transition: theme.other.transition,
    left: 0,
  },
  picture: {
    height: "100%",
    objectFit: "contain",
  },
  pictureBloomed: {
    ref: getRef("pictureBloomed"),
    top: "-100%",
    display: "none",
  },
  title: {
    fontSize: theme.fontSizes.sm,
    position: "absolute",
    width: "100%",
    right: 0,
    bottom: 0,
    background:
      theme.colorScheme === "dark"
        ? theme.colors.dark[7] + "A0"
        : theme.white + "A",
    padding: theme.spacing.xs / 1.25,
    textAlign: "end",
    lineHeight: 1,
  },
}));

function DisplayCard({
  character,
  locale,
}: {
  character: GameCharacter;
  locale: Lang[];
}) {
  const { classes, cx } = useStyles({ color: character.image_color });

  return (
    <Card
      withBorder
      component={Link}
      href={`/characters/${character.character_id}`}
      p={0}
      className={classes.card}
    >
      <Box className={classes.background} />
      <Box className={classes.pictureWrapper}>
        <Picture
          transparent
          src={getAssetURL(
            `assets/card_full1_${
              (twoStarIDs as any)[character.character_id]
            }_normal.png`
          )}
          alt={character.first_name[0]}
          className={classes.picture}
        />
        <Picture
          transparent
          src={getAssetURL(
            `assets/card_full1_${
              (twoStarIDs as any)[character.character_id]
            }_subtracted.png`
          )}
          alt={character.first_name[0]}
          className={cx(classes.picture, classes.pictureBloomed)}
        />
      </Box>
      <Title order={2} className={classes.title}>
        <NameOrder {...character} locale={locale[0].locale} />
      </Title>
    </Card>
  );
}

export default DisplayCard;
