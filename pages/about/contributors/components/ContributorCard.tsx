import {
  ActionIcon,
  Badge,
  Box,
  Group,
  Paper,
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

import ProfileAvatar from "pages/[user]/components/profilePicture/ProfileAvatar";

function makeLanguageArray(languagesString: string) {
  const languageArray = languagesString.split(", ");
  console.log("language array:", languageArray);
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

function ContributorCard({ contributor }: { contributor: any }) {
  const theme = useMantineTheme();
  return (
    <>
      <Paper
        p="md"
        shadow="sm"
        radius="md"
        withBorder
        key={contributor.name + contributor.makotools}
      >
        <Stack>
          <Group spacing="lg" align="center">
            {contributor.admin && <ProfileAvatar size={70} />}
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
      </Paper>
    </>
  );
}

export default ContributorCard;
