import { Box, Text } from "@mantine/core";

import CharacterCard from "./CharacterCard";

import SectionTitle from "pages/events/components/SectionTitle";
import { Lang } from "types/makotools";
import { GameCharacter, GameUnit } from "types/game";
import ResponsiveGrid from "components/core/ResponsiveGrid";
import IconEnstars from "components/core/IconEnstars";
import { Fragment } from "react";

export function UnitSection({
  characters,
  character,
  locale,
  units,
}: {
  characters: GameCharacter[];
  character: GameCharacter;
  locale: Lang[];
  units: GameUnit[];
}) {
  const charaUnits = units.filter((u) => character.unit.includes(u.id));

  return (
    <Box id="unit-info">
      {charaUnits.map((unit, index) => {
        const otherMembers = characters.filter((c) => c.unit.includes(unit.id));
        return (
          <Fragment key={unit.id}>
            <SectionTitle
              id={`unit-${unit.id}`}
              Icon={IconEnstars}
              iconProps={{ unit: unit.id }}
              title={
                <>
                  <Text weight={400} span>
                    {character.first_name[0]} is {index !== 0 ? "also" : ""} a
                    member of{" "}
                  </Text>
                  {unit.name[0]}
                  <Text weight={400} span>
                    !
                  </Text>
                </>
              }
            />
            <ResponsiveGrid width={100}>
              {otherMembers.map((member) => (
                <CharacterCard
                  key={member.character_id}
                  character={member}
                  locale={locale}
                />
              ))}
            </ResponsiveGrid>
            <Text component="p">{unit.description[0]}</Text>
          </Fragment>
        );
      })}
    </Box>
  );
}
