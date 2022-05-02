import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getData, getB2File } from "../../services/ensquare";
import { twoStarIDs } from "../../data/characterIDtoCardID";
import styles from "./CharacterCard.module.scss";
import Card from "../core/Card";

export function CharacterCard({ character }) {
  return (
    <Card>
      <Link href={`/characters/${character.character_id}`}>
        <a
          className={styles.wrapper}
          style={{
            "--characterColor": character.image_color,
          }}
        >
          <div className={styles.content}>
            <div className={styles.image}>
              <Image
                src={
                  character.doubleface
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
                  character.doubleface
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
                {character.doubleface ? " (DF)" : ""}
              </span>
            </div>
          </div>
        </a>
      </Link>
    </Card>
  );
}
