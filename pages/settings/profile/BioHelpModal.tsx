import {
  createStyles,
  Modal,
  Table,
  Title,
  Text,
  useMantineTheme,
  Blockquote,
  Divider,
  Space,
  SimpleGrid,
  Stack,
} from "@mantine/core";
import Link from "next/link";

import emotes from "../../../services/makotools/emotes";

import Emote from "components/utilities/emotes/Emote";

const useStyles = createStyles((theme) => ({
  tableCell: {
    padding: "3px",
    textAlign: "center",
  },
  markdownInput: {
    fontFamily: "monospace",
  },
}));

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
      overlayColor={
        theme.colorScheme === "dark"
          ? theme.colors.dark[9]
          : theme.colors.gray[3]
      }
      overlayOpacity={0.8}
      overlayBlur={5}
      title={<Title order={3}>Markdown Guide</Title>}
    >
      <Text size="sm" color="dimmed">
        Our markdown guide is referenced from{" "}
        <Link
          href="https://markdownguide.org"
          target="_blank"
          style={{ color: theme.colors.indigo[5], textDecoration: "none" }}
        >
          The Markdown Guide
        </Link>{" "}
        and{" "}
        <Link
          href="https://rentry.co"
          target="_blank"
          style={{ color: theme.colors.indigo[5], textDecoration: "none" }}
        >
          Rentry&apos;s markdown guide
        </Link>
        .
      </Text>
      <Space h="xl" />
      <Table withBorder withColumnBorders highlightOnHover>
        <thead>
          <tr>
            <th>Markdown</th>
            <th>Rendered Output</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={classes.tableCell}>
              <Text className={classes.markdownInput}># Heading Level 1</Text>
              <Text className={classes.markdownInput}>## Heading Level 2</Text>
              <Text className={classes.markdownInput}>...</Text>
              <Text className={classes.markdownInput}>
                ###### Heading Level 6
              </Text>
            </td>
            <td className={classes.tableCell}>
              <h1 style={{ margin: 0 }}>Heading Level 1</h1>
              <h2 style={{ margin: 0 }}>Heading Level 2</h2>
              <Text>...</Text>
              <h6 style={{ margin: 0 }}>Heading Level 6</h6>
            </td>
          </tr>
          <tr>
            <td className={classes.tableCell}>
              <Text className={classes.markdownInput}>**Bold Text**</Text>
              <Text className={classes.markdownInput}>*Italicized Text*</Text>
              <Text className={classes.markdownInput}>
                ***Bold and Italicized Text***
              </Text>
              <Text className={classes.markdownInput}>
                ~~Strikethrough Text~~
              </Text>
            </td>
            <td className={classes.tableCell}>
              <Text>
                <strong>Bold Text</strong>
              </Text>
              <Text>
                <i>Italicized Text</i>
              </Text>
              <Text>
                <strong>
                  <i>Bold and Italicized Text</i>
                </strong>
              </Text>
              <Text>
                <s>Strikethrough Text</s>
              </Text>
            </td>
          </tr>
          <tr>
            <td className={classes.tableCell}>
              <Text className={classes.markdownInput}>&gt; Blockquote</Text>
            </td>
            <td className={classes.tableCell}>
              <Blockquote icon={<></>}>Blockquote</Blockquote>
            </td>
          </tr>
          <tr>
            <td className={classes.tableCell}>
              <Text className={classes.markdownInput}>*** or --- or ___</Text>
              <Text className={classes.markdownInput}>
                Try to put a blank line before...
              </Text>
              <Text className={classes.markdownInput}>---</Text>
              <Text className={classes.markdownInput}>
                ... and after a horizontal rule.
              </Text>
            </td>
            <td className={classes.tableCell}>
              <Text>Try to put a blank line before...</Text>
              <Divider />
              <Text>... and after a horizontal rule.</Text>
            </td>
          </tr>
          <tr>
            <td className={classes.tableCell}>
              <Text className={classes.markdownInput}>
                [Link Text](https://linkurl.com)
              </Text>
            </td>
            <td className={classes.tableCell}>
              <Text
                component={Link}
                href="https://www.youtube.com/watch?v=dxrm5TvnOqY"
                target="_blank"
                sx={{ color: theme.colors.indigo[5] }}
              >
                Link Text
              </Text>
            </td>
          </tr>
          <tr>
            <td className={classes.tableCell}>
              <Text className={classes.markdownInput}>
                {`<span style="color:pink">Colored Text!</span>`}
              </Text>
              <Text size="sm" color="dimmed">
                (It&apos;s not markdown, but it&apos;s nice to know.)
              </Text>
            </td>
            <td className={classes.tableCell}>
              <Text sx={{ color: "pink" }}>Colored Text!</Text>
            </td>
          </tr>
        </tbody>
      </Table>
      <Space h="xl" />
      <Title order={4}>You can also use our custom emojis in your bio!</Title>
      <Text color="dimmed" size="sm">
        Non-official emojis are drawn by{" "}
        <Link
          href="https://twitter.com/neeneemi"
          target="_blank"
          style={{
            color: theme.colors.indigo[5],
            textDecoration: "none",
          }}
        >
          @neeneemi
        </Link>
      </Text>
      <Space h="xl" />
      <SimpleGrid
        spacing="xs"
        cols={5}
        breakpoints={[{ maxWidth: 768, cols: 2 }]}
      >
        {emotes.map((emote) => (
          <Stack key={emote.id} spacing="xs" align="center">
            <Emote emote={emote} size={60} />
            <Text className={classes.markdownInput} size="sm">
              {" "}
              :{emote.name.replaceAll(" ", "").toLowerCase()}:{" "}
            </Text>
          </Stack>
        ))}
      </SimpleGrid>
    </Modal>
  );
}

export default BioHelpModal;
