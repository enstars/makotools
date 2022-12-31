import { Input, MultiSelect } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import { Dispatch, SetStateAction, useEffect } from "react";

import { getNameOrder } from "services/game";
import { GameCharacter, GameUnit } from "types/game";
import { Locale, UserData } from "types/makotools";

function FavoriteCharacters({
  characters,
  units,
  profile,
  profileState,
  externalSetter,
  locale,
}: {
  characters: GameCharacter[];
  units: GameUnit[];
  profile: UserData;
  profileState: any;
  externalSetter: Dispatch<SetStateAction<any>>;
  locale: Locale;
}) {
  const [selected, handlers] = useListState<number>(
    profileState.profile__fave_charas || []
  );
  const nameObj = (chara: GameCharacter) => {
    return {
      first_name: chara.first_name[0],
      last_name: chara.last_name[0],
    };
  };

  useEffect(() => {
    externalSetter({ ...profileState, profile__fave_charas: selected });
  }, [selected]);

  return (
    <Input.Wrapper
      label="Favorites"
      my={10}
      styles={(theme) => ({
        description: {
          marginBottom: 5,
        },
      })}
    >
      <MultiSelect
        searchable
        placeholder="Type to search for a character or unit"
        defaultValue={selected.map((id) => id.toString())}
        data={[
          ...characters.map((chara) => ({
            value: chara.character_id.toString(),
            label: getNameOrder(
              nameObj(chara),
              profile.setting__name_order,
              locale
            ),
            group: "Characters",
          })),
          ...units.map((unit) => ({
            value: `2${unit.id.toString()}`,
            label: unit.name[0],
            group: "Units",
          })),
        ]}
        onChange={(values) => {
          if (values) {
            const intValues = values.map((val) => {
              return parseInt(val);
            });
            handlers.setState(intValues);
          }
        }}
        dropdownPosition="bottom"
      />
    </Input.Wrapper>
  );
}

export default FavoriteCharacters;
