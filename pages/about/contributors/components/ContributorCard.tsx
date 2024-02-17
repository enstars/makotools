import {
  ActionIcon,
  Badge,
  Box,
  Group,
  Paper,
  Stack,
  Text,
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
import { useElementSize, useMediaQuery } from "@mantine/hooks";

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

  const { ref, width, height } = useElementSize();

  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`);
  const isAdmin = !!userInfo;

  return (
    <>
      <Paper
        ref={ref}
        sx={{
          display: "flex",
          // flexWrap: "wrap",
          flexDirection: isAdmin && !isMobile ? "row" : "column",
        }}
        // p="md"
        shadow="sm"
        radius="md"
        withBorder
        key={contributor.name + contributor.makotools}
      >
        {userInfo && (
          <Box
            sx={{
              flexBasis: "50%",
              flexGrow: isMobile ? 1 : 0,
            }}
          >
            <Picture
              srcB2={`assets/card_still_full1_${Math.abs(
                userInfo.profile__banner[0]
              )}_${
                userInfo.profile__banner[0] < 0 ? "normal" : "evolution"
              }.png`}
              alt={userInfo.username}
              sx={{
                height: isMobile ? 75 : "100%",
                img: {
                  pointerEvents: "none",
                  objectPosition: "top",
                },
              }}
            />
          </Box>
        )}

        {contributor.admin && (
          <Box
            sx={{
              marginTop: isAdmin && isMobile ? -32 : 0,
              marginBottom: isAdmin && isMobile ? -32 : 0,
              marginLeft: isAdmin && !isMobile ? -32 : 0,
              alignSelf: isAdmin && !isMobile ? "center" : "flex-end",
              position: "relative",
              right: isAdmin && isMobile ? 16 : 0,
            }}
          >
            <ProfileAvatar
              userInfo={userInfo}
              size={64}
              border={`3px solid ${
                theme.colorScheme === "dark" ? theme.colors.dark[6] : "#fff"
              }`}
            />
          </Box>
        )}
        <Box
          sx={{
            flexBasis: "50%",
            flexGrow: 1,
          }}
        >
          <Stack px="sm" py="sm" spacing="sm">
            <Group spacing="lg" align="center">
              <Box>
                <Group spacing="xs" align="center">
                  <Text weight={700}>{contributor.name}</Text>
                  {contributor.makotools && (
                    <Text
                      inline
                      span
                      component={Link}
                      href={`/${contributor.makotools}`}
                      color="dimmed"
                      weight={500}
                      size="sm"
                      // ml="xs"
                    >
                      {contributor.makotools}
                    </Text>
                  )}
                  {contributor.credits && (
                    <ActionIcon
                      component={Link}
                      href={contributor.credits}
                      color={theme.colors[theme.primaryColor][4]}
                      size="xs"
                    >
                      <IconLink size={16} />
                    </ActionIcon>
                  )}
                </Group>
              </Box>
            </Group>
            <Group spacing="xs">
              {contributor.admin && (
                <Badge
                  size="sm"
                  color="indigo"
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
        </Box>
      </Paper>
    </>
  );
}

export default ContributorCard;
