import {
  Group,
  ThemeIcon,
  Box,
  Text,
  DefaultMantineColor,
  Stack,
  Tooltip,
  Image,
} from "@mantine/core";
import { IconCalendar, IconHeart } from "@tabler/icons-react";
import dayjs from "dayjs";

import Picture from "components/core/Picture";
import { GameCharacter, GameUnit } from "types/game";
import { UserData } from "types/makotools";
import { getNameOrder } from "services/game";
import { getAssetURL } from "services/data";

function StatContainer({
  icon,
  iconColor,
  title,
  children,
}: {
  icon: any;
  iconColor: DefaultMantineColor;
  title: string;
  children: any;
}) {
  return (
    <Group
      mt="xs"
      noWrap
      align="flex-start"
      sx={{ flexBasis: "30%", flexGrow: title === "Favorites" ? 1 : 0 }}
    >
      <ThemeIcon variant="light" color={iconColor} sx={{ flexShrink: 0 }}>
        {icon}
      </ThemeIcon>
      <Box>
        <Text size="xs" weight={700} color="dimmed">
          {title}
        </Text>
        {children}
      </Box>
    </Group>
  );
}

function DisplayFaves({
  faveCharas,
  faveUnits,
  characters,
  units,
  profile,
  ...props
}: {
  faveCharas: number[];
  faveUnits: number[];
  characters: GameCharacter[];
  units: GameUnit[];
  profile: UserData;
}) {
  if (faveCharas[0] === 0 && faveUnits[0] === 0) {
    return <Text>Everyone &lt;3</Text>;
  } else if (faveCharas[0] === -1 && faveUnits[0] === -1) {
    return <Text>I hate Ensemble Stars.</Text>;
  } else {
    return (
      <Stack spacing={2}>
        <Group spacing={3}>
          {faveCharas.map((chara: number, index: number) => {
            return (
              <Tooltip
                key={chara}
                label={getNameOrder(
                  {
                    first_name: characters.filter(
                      (c) => c.character_id === chara
                    )[0].first_name[0],
                    last_name: characters.filter(
                      (c) => c.character_id === chara
                    )[0].last_name[0],
                  },
                  profile.setting__name_order
                )}
                transition="slide-up"
                transitionDuration={500}
                offset={0}
                p={3}
              >
                <ThemeIcon
                  variant="default"
                  size={50}
                  radius={25}
                  sx={{ background: "none", border: "none" }}
                >
                  <Picture
                    transparent
                    srcB2={`assets/character_sd_square1_${chara}.png`}
                    alt={
                      characters.filter((c) => c.character_id === chara)[0]
                        .first_name[0]
                    }
                    fill={false}
                    width={50}
                    height={50}
                    sx={{
                      pointerEvents: "none",
                    }}
                  />
                </ThemeIcon>
              </Tooltip>
            );
          })}
        </Group>
        <Group spacing={3}>
          {faveUnits.map((unit: number, index: number) => {
            return (
              <Tooltip
                key={unit}
                label={units.filter((u) => u.id === unit)[0].name[0]}
                position="bottom"
                transition="slide-down"
                transitionDuration={500}
                offset={0}
                p={3}
              >
                <Box
                  p={5}
                  sx={(theme) => ({
                    display: "flex",
                    alignItems: "center",
                    height: 50,
                    minHeight: 50,
                  })}
                >
                  <Image
                    src={getAssetURL(`assets/unit_logo_border_${unit}.png`)}
                    alt={units.filter((u) => u.id === unit)[0].name[0]}
                    height={
                      unit === 16 || unit === 14 || unit === 11 || unit === 8
                        ? 30
                        : unit === 6 || unit === 9
                        ? 20
                        : unit === 15
                        ? 15
                        : 25
                    }
                    width="auto"
                    sx={{ pointerEvents: "none" }}
                  />
                </Box>
              </Tooltip>
            );
          })}
        </Group>
      </Stack>
    );
  }
}

function ProfileStats({
  profile,
  characters,
  units,
}: {
  profile: UserData;
  characters: GameCharacter[];
  units: GameUnit[];
}) {
  return (
    <Group my={7} noWrap spacing="xl" align="flex-start">
      {profile.profile__start_playing !== "0000-00-00" && (
        <StatContainer
          icon={<IconCalendar size={16} />}
          iconColor={"yellow"}
          title={"Started Playing"}
        >
          {profile.profile__start_playing &&
            dayjs(profile.profile__start_playing).format("MMMM YYYY")}
        </StatContainer>
      )}
      {profile.profile__show_faves &&
        profile.profile__fave_charas &&
        profile.profile__fave_units &&
        (profile.profile__fave_charas.length > 0 ||
          profile.profile__fave_units.length > 0) && (
          <StatContainer
            icon={<IconHeart size={16} />}
            iconColor={"pink"}
            title={"Favorites"}
          >
            {profile.profile__fave_charas && (
              <DisplayFaves
                faveCharas={profile.profile__fave_charas}
                faveUnits={profile.profile__fave_units}
                characters={characters}
                units={units}
                profile={profile}
              />
            )}
          </StatContainer>
        )}
    </Group>
  );
}

export default ProfileStats;
