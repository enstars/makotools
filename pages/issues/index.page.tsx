import {
  Box,
  Button,
  Card,
  Center,
  Divider,
  Text,
  ThemeIcon,
  Title,
  TypographyStylesProvider,
} from "@mantine/core";
import {
  IconForms,
  IconGitPullRequest,
  IconMail,
  IconBrandDiscord,
} from "@tabler/icons-react";
import Link from "next/link";

import PageTitle from "components/sections/PageTitle";
import { getLayout } from "components/Layout";
function Page() {
  return (
    <>
      <PageTitle title="Issues and Suggestions" />
      <TypographyStylesProvider>
        <p>
          Did you run into an error on the website? Do you have a suggestion to
          improve the site? You&apos;ve come to the right place!
        </p>
        <p>
          If you&apos;d like to report a bug or provide a suggestion, use any of
          the following methods to reach out to the development team:
        </p>
      </TypographyStylesProvider>
      <Box
        sx={(theme) => ({
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: theme.spacing.xs,
        })}
      >
        {[
          {
            icon: IconForms,
            title: "Google Forms",
            description: "Submit issues or suggestions by filling a form",
            link: "/issues/form",
            color: "violet",
            prompt: "Open forms",
          },
          {
            icon: IconGitPullRequest,
            title: "GitHub Issues",
            description: "Open a new issue on the project's repository",
            link: "https://github.com/enstars/makotools/issues",
            color: "lightblue",
            prompt: "Open new issue",
          },
          {
            icon: IconMail,
            title: "Direct Contact",
            description: "Send us an email descibing your issue or suggesion",
            link: "mailto:makotools@ensemble.moe?subject=Issue Report",
            color: "teal",
            prompt: "Send an email",
          },
          {
            icon: IconBrandDiscord,
            title: "Discord",
            description:
              "Drop a bug or suggestion in the dedicated channels on our Discord server",
            link: "https://discord.gg/TVVuahrD8d",
            color: "green",
            prompt: "Join our Discord",
          },
        ].map((method) => (
          <Card
            key={method.title}
            sx={{ overflow: "visible" }}
            mt="md"
            shadow="sm"
            withBorder
          >
            <Card.Section>
              <Center mt={-32}>
                <ThemeIcon size="xl" radius="xl" color={method.color}>
                  <method.icon size={20} />
                </ThemeIcon>
              </Center>
            </Card.Section>
            <Card.Section pt="sm" px="sm">
              <Title
                order={2}
                sx={(theme) => ({
                  fontSize: theme.fontSizes.md,
                  fontFamily: theme.fontFamily,
                })}
                // ="xs"
                align="center"
              >
                {method.title}
              </Title>
              <Divider my="xs" />
            </Card.Section>
            <Card.Section px="sm">
              <Text align="center" size="sm">
                {method.description}
              </Text>
            </Card.Section>
            <Card.Section px="sm" pt="xs" pb="sm">
              <Button
                component={Link}
                href={method.link}
                target="_blank"
                sx={{ width: "100%" }}
                color={method.color}
                variant="light"
              >
                {method.prompt}
              </Button>
            </Card.Section>
          </Card>
        ))}
      </Box>
    </>
  );
}
Page.getLayout = getLayout({});
export default Page;
