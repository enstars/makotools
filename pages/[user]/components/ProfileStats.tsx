import {
  Group,
  ThemeIcon,
  Box,
  Text,
  DefaultMantineColor,
} from "@mantine/core";
import { IconCalendar, IconHeart } from "@tabler/icons";
import dayjs from "dayjs";

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

function ProfileStats({ profile }: { profile: UserData }) {
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
      <StatContainer
        icon={<IconHeart size={16} />}
        iconColor={"pink"}
        title={"Favorites"}
      >
        Niki, Mayoi, Tomoya
      </StatContainer>
    </Group>
  );
}

export default ProfileStats;
