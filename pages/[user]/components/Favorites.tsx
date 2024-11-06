import {
  Button,
  Checkbox,
  Group,
  Input,
  MultiSelect,
  Stack,
  useMantineTheme,
} from "@mantine/core";
import { useListState } from "@mantine/hooks";
import useTranslation from "next-translate/useTranslation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { EditingProfile } from "./customization/EditProfileModal";

import { getNameOrder } from "services/game";
import { GameCharacter, GameUnit } from "types/game";
import { Locale, UserData } from "types/makotools";

function Favorites({
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
  externalSetter: Dispatch<SetStateAction<EditingProfile>>;
  locale: Locale;
}) {
  const theme = useMantineTheme();
  const { t } = useTranslation("user");
  const [selectedCharas, selectedCharasHandlers] = useListState<number>(
    profileState.profile__fave_charas || []
  );
  const [selectedUnits, selectedUnitsHandlers] = useListState<number>(
    profileState.profile__fave_units || []
  );
  const [faveCharas, charasHandlers] = useListState<number>(
    profileState.profile__fave_charas || []
  );
  const [faveUnits, unitsHandlers] = useListState<number>(
    profileState.profile__fave_units || []
  );
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [showFaves, setShowFaves] = useState<boolean>(
    profileState.profile__show_faves
  );

  const nameObj = (chara: GameCharacter) => {
    return {
      first_name: chara.first_name[0],
      last_name: chara.last_name[0],
    };
  };

  useEffect(() => {
    externalSetter((s) => ({
      ...s,
      profile__fave_charas: faveCharas,
      profile__fave_units: faveUnits,
      profile__show_faves: showFaves,
    }));
  }, [faveCharas, faveUnits, showFaves, externalSetter]);

  useEffect(() => {
    if (window.innerWidth < 768) setIsMobile(true);
  }, []);

  return (
    <Stack mt="sm">
      <Group>
        <Input.Wrapper label={t("faveCharas")}>
          <MultiSelect
            searchable
            placeholder={t("faveCharasPlaceholder")}
            value={selectedCharas.map((id) => id.toString())}
            data={[
              ...characters.map((chara) => ({
                value: chara.character_id.toString(),
                label: getNameOrder(
                  nameObj(chara),
                  profile.setting__name_order,
                  locale
                ),
              })),
            ]}
            onChange={(values) => {
              if (values) {
                const intValues = values.map((val) => {
                  return parseInt(val);
                });
                selectedCharasHandlers.setState(intValues);
                charasHandlers.setState(intValues);
              }
            }}
            dropdownPosition="flip"
            clearable
          />
        </Input.Wrapper>
        <Input.Wrapper label={t("faveUnits")}>
          <MultiSelect
            searchable
            placeholder={t("faveUnitsPlaceholder")}
            value={selectedUnits.map((id) => id.toString())}
            data={[
              ...(units?.map((unit) => ({
                value: unit.id.toString(),
                label: unit.name[0],
              })) ?? []),
            ]}
            onChange={(values) => {
              if (values) {
                const intValues = values.map((val) => {
                  return parseInt(val);
                });
                selectedUnitsHandlers.setState(intValues);
                unitsHandlers.setState(intValues);
              }
            }}
            dropdownPosition="flip"
            clearable
          />
        </Input.Wrapper>
      </Group>
      <Group
        noWrap
        sx={{
          [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
            flexDirection: "column",
            alignItems: "flex-start",
          },
        }}
      >
        <Input.Wrapper
          inputWrapperOrder={["input", "description"]}
          description={t("everyonePDesc")}
          styles={(theme) => ({ description: { marginTop: 3 } })}
        >
          <Button
            variant="light"
            onClick={() => {
              // TODO: compute if someone is an everyoneP via a different method
              selectedUnitsHandlers.setState(units.map((unit) => unit.id));
              selectedCharasHandlers.setState(
                characters.map((chara) => chara.character_id)
              );
              charasHandlers.setState([
                0,
                ...characters.map((chara) => chara.character_id),
              ]);
              unitsHandlers.setState([0, ...units.map((unit) => unit.id)]);
            }}
            disabled={faveCharas[0] === 0 && faveUnits[0] === 0}
          >
            {t("everyonePButton")}
          </Button>
        </Input.Wrapper>
        <Input.Wrapper
          inputWrapperOrder={["input", "description"]}
          description={t("haterDesc")}
          styles={(theme) => ({ description: { marginTop: 3 } })}
        >
          <Button
            variant="light"
            onClick={() => {
              selectedCharasHandlers.setState([]);
              selectedUnitsHandlers.setState([]);
              charasHandlers.setState([-1]);
              unitsHandlers.setState([-1]);
            }}
            disabled={
              faveCharas.length === 1 &&
              faveCharas[0] === -1 &&
              faveUnits.length === 1 &&
              faveUnits[0] === -1
            }
          >
            {t("hater")}
          </Button>
        </Input.Wrapper>
        <Checkbox
          label={t("showFaves")}
          defaultChecked={showFaves}
          onChange={(e) => setShowFaves(e.target.checked)}
        />
      </Group>
    </Stack>
  );
}

export default Favorites;
