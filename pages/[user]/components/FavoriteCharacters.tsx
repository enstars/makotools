import {
  Button,
  Checkbox,
  Group,
  Input,
  MultiSelect,
  Stack,
} from "@mantine/core";
import { useListState } from "@mantine/hooks";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

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
  const [selected, selectedHandlers] = useListState<number>(
    profileState.profile__fave_charas || []
  );
  const [faves, faveHandlers] = useListState<number>(
    profileState.profile__fave_charas || []
  );
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [hideFaves, setHideFaves] = useState<boolean>(false);

  const nameObj = (chara: GameCharacter) => {
    return {
      first_name: chara.first_name[0],
      last_name: chara.last_name[0],
    };
  };

  useEffect(() => {
    externalSetter({
      ...profileState,
      profile__fave_charas: faves,
      profile__show_faves: hideFaves,
    });
  }, [faves, hideFaves]);

  useEffect(() => {
    if (window.innerWidth < 768) setIsMobile(true);
  }, []);

  return (
    <Group my={10}>
      <Stack spacing="xs" sx={{ flex: "0 1 60%" }}>
        <Input.Wrapper
          label="Favorites"
          styles={(theme) => ({
            description: {
              marginBottom: 5,
            },
          })}
        >
          <MultiSelect
            searchable
            placeholder="Type to search for a character or unit"
            value={selected.map((id) => id.toString())}
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
                value: `10${unit.id.toString()}`,
                label: unit.name[0],
                group: "Units",
              })),
            ]}
            onChange={(values) => {
              if (values) {
                const intValues = values.map((val) => {
                  return parseInt(val);
                });
                selectedHandlers.setState(intValues);
                faveHandlers.setState(intValues);
              }
            }}
            dropdownPosition="flip"
            clearable
          />
        </Input.Wrapper>
        <Input.Wrapper inputWrapperOrder={["input", "description"]}>
          <Button.Group>
            <Button
              onClick={() => {
                characters.forEach((chara) => {
                  selectedHandlers.append(chara.character_id);
                });
                units.forEach((unit) => {
                  selectedHandlers.append(parseInt(`10${unit.id.toString()}`));
                });
                faveHandlers.setState([0]);
              }}
              variant="light"
              disabled={faves.length === 1 && faves[0] === 0}
            >
              I love everyone!
            </Button>
            <Button
              onClick={() => {
                selectedHandlers.setState([]);
                faveHandlers.setState([-1]);
              }}
              variant="light"
              disabled={faves.length === 1 && faves[0] === -1}
            >
              I hate Ensemble Stars.
            </Button>
          </Button.Group>
        </Input.Wrapper>
      </Stack>
      <Checkbox
        label="Hide your favorites from your profile"
        sx={{ flex: "1 0 30%" }}
        onChange={(event) => setHideFaves(event.target.checked)}
      />
    </Group>
  );
}

export default FavoriteCharacters;
