import {
  ActionIcon,
  Badge,
  Box,
  Card,
  Group,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import {
  IconBadge,
  IconBrush,
  IconCode,
  IconLink,
  IconTableColumn,
  IconWorld,
} from "@tabler/icons-react";
import Link from "next/link";

import Picture from "components/core/Picture";
import ProfileAvatar from "pages/[user]/components/profilePicture/ProfileAvatar";

function makeLanguageArray(languagesString: string) {
  const languageArray = languagesString.split(", ");
  return languageArray;
}

function ContributorLanguages({
  contributor,
  lang,
}: {
  contributor: any;
  lang: string;
}) {
  return <div>TL: {lang}</div>;
}

function ContributorCard({
  userInfo,
  contributor,
}: {
  userInfo?: any;
  contributor: any;
}) {
  const theme = useMantineTheme();

  return (
    <>
      <Card
        p="md"
        shadow="sm"
        radius="md"
        withBorder
        key={contributor.name + contributor.makotools}
      >
        {userInfo && (
          <Card.Section>
            <Picture
              srcB2={`assets/card_still_full1_${Math.abs(
                userInfo.profile__banner[0]
              )}_${
                userInfo.profile__banner[0] < 0 ? "normal" : "evolution"
              }.png`}
              alt={userInfo.username}
              sx={{
                height: 75,
                img: {
                  pointerEvents: "none",
                },
              }}
            />
          </Card.Section>
        )}
        <Stack>
          <Group spacing="lg" align="center">
            {contributor.admin && (
              <Box sx={{ marginTop: -35 }}>
                <ProfileAvatar
                  userInfo={userInfo}
                  size={70}
                  border={`3px solid ${
                    theme.colorScheme === "dark" ? theme.colors.dark[6] : "#fff"
                  }`}
                />
              </Box>
            )}
            <Box>
              <Group spacing="xs" align="center">
                <Title order={3} size="h5">
                  {contributor.name}
                </Title>
                {contributor.credit && (
                  <ActionIcon
                    component={Link}
                    href={contributor.credit}
                    color={theme.colors[theme.primaryColor][4]}
                  >
                    <IconLink size={16} />
                  </ActionIcon>
                )}
              </Group>

              {contributor.makotools && (
                <Text
                  component={Link}
                  href={`/${contributor.makotools}`}
                  color="dimmed"
                >
                  {contributor.makotools}
                </Text>
              )}
            </Box>
          </Group>
          <Group>
            {contributor.admin && (
              <Badge
                leftSection={<IconBadge size={16} />}
                styles={{
                  leftSection: {
                    height: 16,
                  },
                }}
              >
                Admin
              </Badge>
            )}
            {contributor.dev && (
              <Badge
                color="violet"
                leftSection={<IconCode size={16} />}
                styles={{
                  leftSection: {
                    height: 16,
                  },
                }}
              >
                Developer
              </Badge>
            )}
            {contributor.data && (
              <Badge
                color="teal"
                leftSection={<IconTableColumn size={16} />}
                styles={{
                  leftSection: {
                    height: 16,
                  },
                }}
              >
                Data
              </Badge>
            )}
            {contributor.design && (
              <Badge
                color="pink"
                leftSection={<IconBrush size={16} />}
                styles={{
                  leftSection: {
                    height: 16,
                  },
                }}
              >
                Design
              </Badge>
            )}
            {contributor.translation &&
              makeLanguageArray(contributor.lang).map((lang) => {
                return (
                  <Badge
                    color="yellow"
                    leftSection={<IconWorld size={16} />}
                    key={`${contributor.name}_${lang}`}
                    styles={{
                      leftSection: {
                        height: 16,
                      },
                    }}
                  >
                    <ContributorLanguages
                      contributor={contributor}
                      lang={lang}
                    />
                  </Badge>
                );
              })}
          </Group>
        </Stack>
      </Card>
    </>
  );
}

export default ContributorCard;
