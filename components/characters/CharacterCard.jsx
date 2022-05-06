import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getData, getB2File } from "../../services/ensquare";
import { twoStarIDs } from "../../data/characterIDtoCardID";
import styles from "./CharacterCard.module.scss";
import { Card, Paper } from "@mantine/core";

export function CharacterCard({ i, doubleface, unique_id, characters }) {
  const character = characters[0][i];
  const characterSubLang = characters[1]?.[i] || undefined;
  // console.log(characters);
  return (
    <Link href={`/characters/${character.character_id}`} passHref>
      <Card
        withBorder
        component="a"
        className={styles.wrapper}
        style={{
          "--characterColor": character.image_color,
          "--characterColor--light": character.image_color + "33",
        }}
      >
        <div className={styles.content}>
          <div className={styles.image}>
            <Image
              src={
                doubleface
                  ? getB2File(
                      `cards/card_full1_${
                        twoStarIDs.doubleface[character.character_id]
                      }_normal.png`
                    )
                  : getB2File(
                      `cards/card_full1_${
                        twoStarIDs[character.character_id]
                      }_normal.png`
                    )
              }
              alt={character.first_name} // width="2000"
              // height="2000"
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
                        twoStarIDs.doubleface[character.character_id]
                      }_evolution.png`
                    )
                  : getB2File(
                      `cards/card_full1_${
                        twoStarIDs[character.character_id]
                      }_evolution.png`
                    )
              }
              alt={character.first_name} // width="2000"
              // height="2000"
              layout="fill"
              objectFit="contain"
            />
          </div>
          <div className={styles.info}>
            <span>
              {character.last_name}
              {character.first_name}
              {characterSubLang?.last_name}
              {characterSubLang?.first_name}
              {doubleface ? " (DF)" : ""}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
