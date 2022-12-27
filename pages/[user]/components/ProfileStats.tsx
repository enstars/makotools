import {
  Group,
  ThemeIcon,
  Box,
  Text,
  DefaultMantineColor,
} from "@mantine/core";
import { IconCalendar, IconHeart } from "@tabler/icons";
import dayjs from "dayjs";

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
    <Group my={5} noWrap spacing="xl">
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
              <Text>
                {profile.profile__fave_charas.map((chara, index) => {
                  return profile.profile__fave_charas &&
                    index === profile.profile__fave_charas.length - 1
                    ? characters.filter((c) => c.character_id === chara)[0]
                        .first_name[0]
                    : `${
                        characters.filter((c) => c.character_id === chara)[0]
                          .first_name[0]
                      }, `;
                })}
              </Text>
            )}
          </StatContainer>
        )}
    </Group>
  );
}

export default ProfileStats;
