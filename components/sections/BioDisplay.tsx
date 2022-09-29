import {
  Center,
  createEmotionCache,
  createStyles,
  Loader,
  MantineProvider,
  Paper,
  PaperProps,
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
import NormalizeCSS from "raw-loader!../../styles/iFrameCSS.txt";
import { useViewportSize } from "@mantine/hooks";

import { CONSTANTS } from "../../services/makotools/constants";
import emotes from "../../services/makotools/emotes";
const emoji = {
  name: "emoji",
  level: "inline", // This is an inline-level tokenizer
  start(src: string) {
    return src.indexOf(":");
  }, // Hint to Marked.js to stop and check for a match
  tokenizer(src: any) {
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
  renderer(token: any) {
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
  paper: {
    display: "flex",
  },
}));

function BioDisplay({
  rawBio = "",
  ...props
}: PaperProps & { rawBio?: string }) {
  const iframeRef = useRef<HTMLIFrameElement>();
  const [height, setHeight] = useState(0);
  const { classes } = useStyles();
  const [ready, setReady] = useState(false);
  const { width } = useViewportSize();

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    let timeout: any;
    function updateHeight() {
      const iframe = iframeRef;
      const contentHeight =
        iframe.current?.contentDocument?.body.offsetHeight ?? 0;
      // console.log("sdjlkfjsd", contentHeight, iframe);
      if (
        typeof contentHeight === "number" &&
        contentHeight !== 0 &&
        height !== contentHeight
      ) {
        setHeight(contentHeight);
      }
      timeout = setTimeout(updateHeight, 1000);
    }
    updateHeight();

    return () => {
      clearTimeout(timeout);
    };
  }, [iframeRef, rawBio, height, width]);
  // if (!rawBio) return null;

  const UNSAFEhtml = marked.parse(rawBio || "");
  const safeHtml = DOMPurify.sanitize(UNSAFEhtml);
  // console.table({ rawBio, UNSAFEhtml, safeHtml });

  return (
    <Paper withBorder p="sm" className={classes.paper} {...props}>
      {ready ? (
        <Frame
          style={{ height }}
          className={classes.frame}
          // @ts-ignore
          ref={iframeRef}
          scrolling="no"
          // loading="eager"
          contentDidMount={() => {
            // i literally cannot find a way to run a function once
            // all images and stuff are loaded in an iframe so this
            // will have to do. if anyone has a better rewrite please PR
          }}
        >
          <FrameContextConsumer>
            {({ document }) => {
              // console.log("aaaaajsklfjdlskfjdsl");
              const emotionCache = createEmotionCache({
                key: "mantine",
                container: document?.head, // with this line, emotion renders styles inside the shadow dom element created before
              });
              return (
                <>
                  <MantineProvider
                    inherit
                    emotionCache={emotionCache}
                    withNormalizeCSS
                  >
                    <TypographyStylesProvider
                      sx={{ display: "flow-root" }}
                      className="bio"
                    >
                      <div dangerouslySetInnerHTML={{ __html: safeHtml }} />
                    </TypographyStylesProvider>
                    {/* {safeHtml} */}
                  </MantineProvider>
                  <style>{NormalizeCSS}</style>
                </>
              );
            }}
          </FrameContextConsumer>
        </Frame>
      ) : (
        <>
          <Center sx={{ flexGrow: 1 }}>
            <Loader />
          </Center>
        </>
      )}
    </Paper>
  );
}

export default BioDisplay;
