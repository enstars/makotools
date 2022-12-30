import {
  Group,
  ThemeIcon,
  Box,
  Text,
  DefaultMantineColor,
} from "@mantine/core";
import { IconCalendar, IconHeart } from "@tabler/icons";
import dayjs from "dayjs";

import Picture from "components/core/Picture";
import { GameCharacter } from "types/game";
import { UserData } from "types/makotools";

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
    <Group mt="xs" noWrap align="flex-start">
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

function ProfileStats({
  profile,
  characters,
}: {
  profile: UserData;
  characters: GameCharacter[];
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
      {profile.profile__fave_charas &&
        profile.profile__fave_charas.length > 0 && (
          <StatContainer
            icon={<IconHeart size={16} />}
            iconColor={"pink"}
            title={"Favorites"}
          >
            {profile.profile__fave_charas && (
              <Group spacing={0}>
                {profile.profile__fave_charas.map((chara, index) => {
                  return (
                    <Picture
                      transparent
                      key={chara}
                      srcB2={`assets/character_sd_square1_${chara}.png`}
                      alt={
                        characters.filter((c) => c.character_id === chara)[0]
                          .first_name[0]
                      }
                      sx={{ width: 50, height: 50, pointerEvents: "none" }}
                    />
                  );
                })}
              </Group>
            )}
          </StatContainer>
        )}
    </Group>
  );
}

export default ProfileStats;