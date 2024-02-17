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
import useTranslation from "next-translate/useTranslation";
import Trans from "next-translate/Trans";

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
  const { t } = useTranslation("user");
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
      <Trans
        i18nKey="user:markdown.credits"
        components={[
          <Link
            key="markdown"
            href="https://markdownguide.org"
            target="_blank"
            style={{
              color: theme.colors[theme.primaryColor][5],
              textDecoration: "none",
            }}
          />,
          <Link
            key="rentry"
            href="https://rentry.co"
            target="_blank"
            style={{
              color: theme.colors[theme.primaryColor][5],
              textDecoration: "none",
            }}
          />,
        ]}
      />
      <Space h="xl" />
      <Title order={4}>{t("markdown.basicMarkdown")}</Title>
      <SamplePreview
        markdown={`**${t("markdown.boldText")}**`}
        result={<b>{t("markdown.boldText")}</b>}
      />
      <SamplePreview
        markdown={`*${t("markdown.italicizedText")}*`}
        result={<i>{t("markdown.italicizedText")}</i>}
      />
      <SamplePreview
        markdown={`***${t("markdown.boldItalicizedText")}***`}
        result={
          <b>
            <i>{t("markdown.boldItalicizedText")}</i>
          </b>
        }
      />
      <SamplePreview
        markdown={`~~${t("markdown.strikethrough")}~~`}
        result={<s>{t("markdown.strikethrough")}</s>}
      />
      <Space h="xl" />
      <Title order={4}>{t("markdown.headings")}</Title>
      <SamplePreview
        markdown={`# ${t("markdown.headingLevel")} 1`}
        result={<h1 style={{ margin: 0 }}>{t("markdown.headingLevel")} 1</h1>}
      />
      <SamplePreview
        markdown={`## ${t("markdown.headingLevel")} 2`}
        result={<h2 style={{ margin: 0 }}>{t("markdown.headingLevel")} 2</h2>}
      />
      <SamplePreview
        markdown={`### ${t("markdown.headingLevel")} 3`}
        result={<h3 style={{ margin: 0 }}>{t("markdown.headingLevel")} 3</h3>}
      />
      <Space h="xl" />
      <Title order={4}>Miscellaneous</Title>
      <SamplePreview
        markdown={`> ${t("markdown.blockquote")}`}
        result={
          <TypographyStylesProvider>
            <blockquote style={{ margin: 0 }}>
              {t("markdown.blockquote")}
            </blockquote>
          </TypographyStylesProvider>
        }
      />
      <SamplePreview
        markdown={
          <>
            <Trans
              i18nKey="user:markdown.horizontalRule"
              components={[<br key="br" />]}
            />
          </>
        }
        result={
          <TypographyStylesProvider>
            <Trans
              i18nKey="user:markdown.properHr"
              components={[<hr key="hr" />]}
            />
          </TypographyStylesProvider>
        }
      />
      <SamplePreview
        markdown={`[${t("markdown.linkText")}](https://example.com)`}
        result={
          <TypographyStylesProvider>
            <a
              target="_blank"
              href="https://www.youtube.com/watch?v=dxrm5TvnOqY"
              rel="noreferrer"
            >
              {t("markdown.linkText")}
            </a>
          </TypographyStylesProvider>
        }
      />
      <SamplePreview
        markdown={`<span style="color:pink;">${t("markdown.pepetired")}</span>`}
        result={
          <span style={{ color: "pink" }}>{t("markdown.pepetired")}</span>
        }
      />
      <SamplePreview
        markdown={`<span style="text-decoration:underline">${t(
          "markdown.underlinedText"
        )}</span>`}
        result={<u>{t("markdown.underlinedText")}</u>}
      />
      <Space h="xl" />
      <Title order={4}>{t("markdown.customEmoji")}</Title>
      <Text color="dimmed" size="sm">
        <Trans
          i18nKey="user:markdown.emojiCredit"
          components={[
            <Link
              key="link"
              href="https://twitter.com/HELLOGlRLS"
              target="_blank"
              style={{
                color: theme.colors[theme.primaryColor][5],
                textDecoration: "none",
              }}
            />,
          ]}
        />
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
