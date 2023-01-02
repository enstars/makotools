import {
  createStyles,
  Modal,
  Title,
  Text,
  useMantineTheme,
  Space,
  Stack,
  Group,
  Paper,
  TypographyStylesProvider,
} from "@mantine/core";
import Link from "next/link";

import emotes from "services/makotools/emotes";
import Emote from "components/utilities/emotes/Emote";
import ResponsiveGrid from "components/core/ResponsiveGrid";

const useStyles = createStyles((theme) => ({
  tableCell: {
    padding: "3px",
    textAlign: "center",
  },
  markdownInput: {
    fontFamily: "monospace",

    ["@media (max-width: 768px)"]: {
      fontSize: "11px",
    },
  },
}));

function SamplePreview({
  markdown,
  result,
}: {
  markdown: React.ReactNode;
  result: React.ReactNode;
}) {
  const theme = useMantineTheme();
  const { classes } = useStyles();
  const shadeColor =
    theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[1];
  const borderColor =
    theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[2];
  return (
    <Group
      align="stretch+"
      sx={(theme) => ({
        "&&&&&": {
          flexWrap: "wrap",
        },
        "& > *": {
          flex: "1 1 0",
          ["@media (max-width: 768px)"]: {
            flex: "1 1 100%",
          },
        },
      })}
      spacing={0}
      mb={6}
    >
      <Paper
        sx={{
          background: shadeColor,
          border: `1px solid ${borderColor}`,
          borderRight: "none",
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,

          ["@media (max-width: 768px)"]: {
            borderBottom: "none",
            borderRight: `1px solid ${borderColor}`,
            borderTopLeftRadius: theme.radius.xs,
            borderTopRightRadius: theme.radius.xs,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          },
        }}
        px="xs"
        py={6}
      >
        {markdown}
      </Paper>
      <Paper
        sx={(theme) => ({
          border: `1px solid ${borderColor}`,
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          borderLeft: "none",

          ["@media (max-width: 768px)"]: {
            borderTop: "none",
            borderLeft: `1px solid ${borderColor}`,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            borderBottomLeftRadius: theme.radius.xs,
            borderBottomRightRadius: theme.radius.xs,
          },
        })}
        px="xs"
        py={6}
      >
        {result}
      </Paper>
    </Group>
  );
}

function BioHelpModal({
  opened,
  openFunction,
}: {
  opened: boolean;
  openFunction: any;
}) {
  const theme = useMantineTheme();
  const { classes } = useStyles();

  return (
    <Modal
      opened={opened}
      size="xl"
      onClose={() => openFunction(false)}
      overflow="inside"
      overlayOpacity={0.8}
      overlayBlur={5}
      title={<Title order={3}>Markdown Guide</Title>}
      sx={{
        ["@media (max-width: 768px)"]: {
          width: "100%",
        },
      }}
    >
      <Text size="sm" color="dimmed">
        Our markdown guide is referenced from{" "}
        <Link
          href="https://markdownguide.org"
          target="_blank"
          style={{
            color: theme.colors[theme.primaryColor][5],
            textDecoration: "none",
          }}
        >
          The Markdown Guide
        </Link>{" "}
        and{" "}
        <Link
          href="https://rentry.co"
          target="_blank"
          style={{
            color: theme.colors[theme.primaryColor][5],
            textDecoration: "none",
          }}
        >
          Rentry&apos;s markdown guide
        </Link>
        .
      </Text>
      <Space h="xl" />
      <Title order={4}>Basic Markdown</Title>
      <SamplePreview markdown={"**Bold Text**"} result={<b>Bold Text</b>} />
      <SamplePreview
        markdown={"*Italicized Text*"}
        result={<i>Italicized Text</i>}
      />
      <SamplePreview
        markdown={"***Bold and Italicized Text***"}
        result={
          <b>
            <i>Bold and Italicized Text</i>
          </b>
        }
      />
      <SamplePreview
        markdown={"~~Strikethrough Text~~"}
        result={<s>Strikethrough Text</s>}
      />
      <Space h="xl" />
      <Title order={4}>Headings</Title>
      <SamplePreview
        markdown={"# Heading Level 1"}
        result={<h1 style={{ margin: 0 }}>Heading Level 1</h1>}
      />
      <SamplePreview
        markdown={"## Heading Level 2"}
        result={<h2 style={{ margin: 0 }}>Heading Level 2</h2>}
      />
      <SamplePreview
        markdown={"### Heading Level 3"}
        result={<h3 style={{ margin: 0 }}>Heading Level 3</h3>}
      />
      <Space h="xl" />
      <Title order={4}>Miscellaneous</Title>
      <SamplePreview
        markdown={"> Blockquote"}
        result={
          <TypographyStylesProvider>
            <blockquote style={{ margin: 0 }}>Blockquote</blockquote>
          </TypographyStylesProvider>
        }
      />
      <SamplePreview
        markdown={
          <>
            Three dashes make...
            <br />
            ---
            <br />
            ...a dividing line.
          </>
        }
        result={
          <TypographyStylesProvider>
            Three dashes make...
            <hr />
            ...a dividing line.
          </TypographyStylesProvider>
        }
      />
      <SamplePreview
        markdown={`[Link Text](https://example.com)`}
        result={
          <TypographyStylesProvider>
            <a
              target="_blank"
              href="https://www.youtube.com/watch?v=dxrm5TvnOqY"
              rel="noreferrer"
            >
              Link Text
            </a>
          </TypographyStylesProvider>
        }
      />
      <SamplePreview
        markdown={`<span style="color:pink;">Isara Mao!</span>`}
        result={<span style={{ color: "pink" }}>Isara Mao!</span>}
      />
      <SamplePreview
        markdown={`<span style="text-decoration:underline">Underlined Text</span>`}
        result={<u>Underlined Text</u>}
      />
      <Space h="xl" />
      <Title order={4}>You can also use our custom emojis in your bio!</Title>
      <Text color="dimmed" size="sm">
        Non-official emojis are drawn by{" "}
        <Link
          href="https://twitter.com/neeneemi"
          target="_blank"
          style={{
            color: theme.colors[theme.primaryColor][5],
            textDecoration: "none",
          }}
        >
          @neeneemi
        </Link>
        ! Check them out!
      </Text>
      <Space h="xl" />
      <ResponsiveGrid width={120}>
        {emotes.map((emote) => (
          <Stack key={emote.id} spacing="xs" align="center">
            <Emote emote={emote} size={60} />
            <Text className={classes.markdownInput} size="sm">
              :{emote.name.replaceAll(" ", "").toLowerCase()}:{" "}
            </Text>
          </Stack>
        ))}
      </ResponsiveGrid>
    </Modal>
  );
}

export default BioHelpModal;
