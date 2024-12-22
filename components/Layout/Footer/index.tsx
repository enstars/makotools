import Link from "next/link";
import {
  Footer,
  Text,
  Anchor,
  useMantineTheme,
  Stack,
  Group,
  Box,
  Container,
} from "@mantine/core";
import useTranslation from "next-translate/useTranslation";

import SvgBackground from "./mkt_bg.svg";
import SupportBanner from "./SupportBanner";

import Affiliates from "assets/Affiliates/affiliates.svg";
import { CONSTANTS } from "services/makotools/constants";
import { useQuery } from "@tanstack/react-query";
import { commitQueries } from "services/queries";
import { useDayjs } from "services/libraries/dayjs";

function PageFooter({ wide, textOnly }: { wide: boolean; textOnly: boolean }) {
  const { t } = useTranslation("footer");
  const theme = useMantineTheme();
  const { dayjs } = useDayjs();
  const { data: lastCommit, error: lastCommitError } = useQuery({
    queryKey: commitQueries.fetchLatestCommit,
    queryFn: async () => {
      try {
        const res = await fetch("/api/github/latest");
        return await res.json();
      } catch (e) {
        throw new Error("Could not fetch latest commit");
      }
    },
  });
  const lastCommitDate = dayjs(lastCommit?.commit_date);
  const commitUrl = lastCommit?.commit_url;
  return (
    <Footer
      style={{
        top: 0,
        zIndex: 0,
        display: "flow-root",
        borderTop: "none",
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[9]
            : theme.colors.gray[0],
        position: "relative",
        overflow: "hidden",
      }}
      pt="xl"
      p="md"
      height="auto"
    >
      <Text
        color="dimmed"
        sx={{
          svg: {
            position: "absolute",
            // height: "100%",
            // width: "100%",
            right: 0,
            bottom: 0,
            strokeWidth: 10,
            objectPosition: "right",
            objectFit: "cover",
            maskImage: "linear-gradient(135deg, transparent 70%, #fff6 100%)",
            pointerEvents: "none",

            width: "200%",
            height: "140%",
          },
        }}
      >
        <SvgBackground
          viewBox="0 0 5266 5266"
          preserveAspectRatio="xMaxYMax meet"
        />
      </Text>
      <Container
        size={"sm"}
        px="xl"
        py="md"
        sx={(theme) => ({
          width: "100%",
          "@media (max-width: 768px)": {
            padding: theme.spacing.md,
          },
        })}
      >
        <Group
          sx={{
            flexWrap: "wrap",
            alignItems: "flex-start",
          }}
          spacing="xs"
        >
          <Stack
            spacing={3}
            sx={{
              flexBasis: 150,
              maxWidth: 350,
              flexGrow: 1,
              alignItems: "flex-start",
            }}
            mb="xl"
          >
            <SupportBanner mb="xs" sx={{ width: "100%" }} />
            <Anchor component={Link} href="/issues" size="sm">
              {t("links.issues")}
            </Anchor>
            <Anchor
              component={Link}
              href={`mailto:${CONSTANTS.MAKOTOOLS.EMAIL}`}
              size="sm"
            >
              {t("links.contact")}
            </Anchor>
            <Anchor component={Link} href="/about" size="sm">
              {t("links.about")}
            </Anchor>
            <Text color="dimmed" size="xs" mt="xs">
              <Anchor
                component={Link}
                href="/about/guidelines"
                inherit
                color="dimmed"
              >
                {t("links.guidelines")}
              </Anchor>
              <br />
              <Anchor
                component={Link}
                href="/about/terms"
                inherit
                color="dimmed"
              >
                {t("links.tos")}
              </Anchor>
              {" · "}
              <Anchor
                component={Link}
                href="/about/privacy"
                inherit
                color="dimmed"
              >
                {t("links.privacyPolicy")}
              </Anchor>
            </Text>
          </Stack>

          <Box sx={{ flexGrow: 0.1 }} />
          <Box sx={{ flex: "1 1 350px", maxWidth: 560 }}>
            {!textOnly && (
              <Text
                color="dimmed"
                mb="xs"
                sx={{
                  svg: {
                    maxWidth: 500,
                    minWidth: 250,
                    width: "60%",
                  },
                }}
              >
                <Affiliates viewBox="0 0 898 239" height={"auto"} />
              </Text>
            )}
            <Text size="xs" color="dimmed" mt="xs">
              {t("disclaimer")}
            </Text>
            {lastCommit && (
              <Group mt="xs" spacing="xs">
                <Text size="xs" color="dimmed">
                  Last updated {dayjs(lastCommitDate).fromNow()}
                </Text>
                {commitUrl && (
                  <>
                    {" "}
                    <Text size="xs" color="dimmed">
                      {" "}
                      ·{" "}
                    </Text>
                    <Anchor
                      component={Link}
                      href={commitUrl}
                      size="xs"
                      target="_blank"
                    >
                      View commit on GitHub
                    </Anchor>
                  </>
                )}
              </Group>
            )}
          </Box>
        </Group>
      </Container>
    </Footer>
  );
}

export default PageFooter;
