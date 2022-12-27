import { Input, MultiSelect } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import { Dispatch, SetStateAction, useEffect } from "react";

import { getNameOrder } from "services/game";
import { GameCharacter } from "types/game";
import { Locale, UserData } from "types/makotools";

function FavoriteCharacters({
  characters,
  profile,
  profileState,
  externalSetter,
  locale,
}: {
  characters: GameCharacter[];
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
      label="Favorite Characters"
      description="Choose up to three characters"
      my={10}
      styles={(theme) => ({
        description: {
          marginBottom: 5,
        },
      })}
    >
      <MultiSelect
        searchable
        placeholder="Type to search for a character"
        defaultValue={selected.map((id) => id.toString())}
        data={[
          {
            value: "-",
            label: "Start typing to search for a character...",
            disabled: true,
          },
          ...characters.map((chara) => ({
            value: chara.character_id.toString(),
            label: getNameOrder(
              nameObj(chara),
              profile.setting__name_order,
              locale
            ),
          })),
        ]}
        maxSelectedValues={3}
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
