import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, Title, useMantineTheme } from "@mantine/core";

import { getB2File } from "../../../services/ensquare";
import {
  twoStarIDs,
  twoStarIDsDoubleface,
} from "../../../data/characterIDtoCardID";
import styles from "../../../styles/CharacterCard.module.scss";

function DisplayCard({
  i,
  doubleface,
  characters,
}: {
  i: number;
  doubleface: boolean;
  characters: any;
}) {
  const theme = useMantineTheme();
  const character: GameCharacter = characters.mainLang.data[i];
  const characterSubLang = characters.subLang.data?.[i] || undefined;
  return (
    <Link href={`/characters/${character.character_id}`} passHref>
      <Card
        withBorder
        component="a"
        className={styles.wrapper}
        style={{
          ["--characterColor" as string]: character.image_color,
          ["--characterColor--light" as string]: character.image_color + "33",
        }}
      >
        <div className={styles.content}>
          <div className={styles.image}>
            <Image
              src={
                doubleface
                  ? getB2File(
                      `cards/card_full1_${
                        (twoStarIDsDoubleface as any)[character.character_id]
                      }_normal.png`
                    )
                  : getB2File(
                      `cards/card_full1_${
                        twoStarIDs[character.character_id]
                      }_normal.png`
                    )
              }
              alt={character.first_name}
              layout="fill"
              objectFit="contain"
            />
          </div>
          <div className={[styles.image, styles.bloomed].join(" ")}>
            <Image
              src={
                doubleface
                  ? getB2File(
                      `cards/card_full1_${
                        (twoStarIDsDoubleface as any)[character.character_id]
                      }_evolution.png`
                    )
                  : getB2File(
                      `cards/card_full1_${
                        twoStarIDs[character.character_id]
                      }_evolution.png`
                    )
              }
              alt={character.first_name}
              layout="fill"
              objectFit="contain"
            />
          </div>
          <div className={styles.info}>
            <Title order={2} sx={{ fontSize: theme.fontSizes.sm }}>
              {character.last_name}
              {characters.mainLang.lang === "en" && " "}
              {character.first_name}
              {doubleface ? " (DF)" : ""}
            </Title>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export default DisplayCard;