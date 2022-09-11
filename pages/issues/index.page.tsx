import {
  Accordion,
  Anchor,
  Box,
  Button,
  Card,
  Center,
  Divider,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
  TypographyStylesProvider,
} from "@mantine/core";
import { IconForms, IconGitPullRequest, IconMail } from "@tabler/icons";
import Link from "next/link";

import PageTitle from "../../components/sections/PageTitle";
import { getLayout } from "../../components/Layout";
function Page() {
  return (
    <>
      <PageTitle title="Issues and Suggestions"></PageTitle>
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
        ].map((method) => (
          <Card key={method.title} sx={{ overflow: "visible" }} mt="md">
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
              <Link href={method.link} passHref target="_blank">
                <Button
                  component="a"
                  sx={{ width: "100%" }}
                  color={method.color}
                  variant="light"
                >
                  {method.prompt}
                </Button>
              </Link>
            </Card.Section>
          </Card>
        ))}
      </Box>
    </>
  );
}
Page.getLayout = getLayout({});
export default Page;
