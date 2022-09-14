import {
  createEmotionCache,
  createStyles,
  MantineProvider,
  Paper,
  Textarea,
  TypographyStylesProvider,
} from "@mantine/core";
import Markdown from "marked-react";
import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";
import dynamic from "next/dynamic";
import {
  createRef,
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Head from "next/head";
import Frame, { FrameContextConsumer, useFrame } from "react-frame-component";
import NormalizeCSS from "raw-loader!../../styles/normalize.notcss";

import { CONSTANTS } from "../../services/constants";
import { useFirebaseUser } from "../../services/firebase/user";
import emotes from "../../services/emotes";
const emoji = {
  name: "emoji",
  level: "inline", // This is an inline-level tokenizer
  start(src) {
    return src.indexOf(":");
  }, // Hint to Marked.js to stop and check for a match
  tokenizer(src, tokens) {
    const rule = /^:(\w+):/; // Regex for the complete token, anchor to string start
    const match = rule.exec(src);
    if (match) {
      return {
        // Token to generate
        type: "emoji", // Should match "name" above
        raw: match[0], // Text to consume from the source
        emoji: match[1], // Additional custom properties
      };
    }
  },
  renderer(token) {
    const emote = emotes.find(
      (e) => e.name.replace(/ /g, "").toLocaleLowerCase() === token.emoji
    );
    if (emote)
      return `<span class="emoji"><img src="${emote.emote.src}" alt="${emote.name}" /></span>`;
    return token.raw;
  },
};

marked.use({ extensions: [emoji] });
marked.setOptions({
  pedantic: false,
  gfm: true,
  breaks: true,
  smartLists: true,
  smartypants: false,
  xhtml: false,
  baseUrl: CONSTANTS.EXTERNAL_URLS.ASSETS,
});

const useStyles = createStyles(() => ({
  frame: {
    overflow: "hidden",
    border: 0,
    outline: "none",
    width: "100%",
  },
}));

function BioDisplay() {
  const { user } = useFirebaseUser();
  const iframeRef = useRef();
  const [height, setHeight] = useState(500);
  const { classes } = useStyles();

  const handleResize = useCallback((iframe) => {
    const contentHeight =
      iframe.current?.contentDocument?.body.offsetHeight ?? 0;
    if (contentHeight !== 0 && height !== contentHeight) {
      setHeight(contentHeight);
    }
  }, []);

  if (!user.loggedIn) return null;

  const UNSAFEhtml = marked.parse(user.db?.profile__bio || "");
  const safeHtml = DOMPurify.sanitize(UNSAFEhtml);

  return (
    <Paper withBorder p="sm">
      <Frame
        style={{ height }}
        className={classes.frame}
        ref={iframeRef}
        scrolling="no"
        loading="eager"
        contentDidMount={() => {
          // i literally cannot find a way to run a function once
          // all images and stuff are loaded in an iframe so this
          // will have to do. if anyone has a better rewrite please PR
          function setHeight() {
            handleResize(iframeRef);
            setTimeout(setHeight, 1000);
          }
          setHeight();
        }}
      >
        <FrameContextConsumer>
          {({ document }) => {
            const emotionCache = createEmotionCache({
              key: "mantine",
              container: document?.head, // with this line, emotion renders styles inside the shadow dom element created before
            });
            return (
              <MantineProvider
                inherit
                emotionCache={emotionCache}
                withNormalizeCSS
              >
                <style>{NormalizeCSS}</style>
                <TypographyStylesProvider sx={{ display: "flow-root" }}>
                  <div dangerouslySetInnerHTML={{ __html: safeHtml }} />
                </TypographyStylesProvider>
              </MantineProvider>
            );
          }}
        </FrameContextConsumer>
      </Frame>
    </Paper>
  );
}

export default BioDisplay;
