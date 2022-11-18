import {
  Center,
  createEmotionCache,
  createStyles,
  Loader,
  MantineProvider,
  Paper,
  PaperProps,
  TypographyStylesProvider,
} from "@mantine/core";
import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";
import { useEffect, useRef, useState } from "react";
import Frame, { FrameContextConsumer } from "react-frame-component";
import NormalizeCSS from "raw-loader!../../styles/iFrameCSS.txt";
import { useViewportSize } from "@mantine/hooks";

import { CONSTANTS } from "../../services/makotools/constants";
import emotes from "../../services/makotools/emotes";

const emote = {
  name: "emote",
  level: "inline",
  start(src: string) {
    return src.indexOf(":");
  },
  tokenizer(src: any) {
    const rule = /^:(\w+):/;
    const match = rule.exec(src);
    if (match) {
      return {
        type: "emote",
        raw: match[0],
        emote: match[1],
      };
    }
  },
  renderer(token: any) {
    const emote = emotes.find(
      (e) => e.name.replace(/ /g, "").toLocaleLowerCase() === token.emote
    );
    if (emote)
      return `<span class="emote"><img src="${emote.emote.src}" alt="${emote.name}" /></span>`;
    return token.raw;
  },
};

marked.use({ extensions: [emote] });
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
    colorScheme: "light",
  },
}));

function BioDisplay({
  rawBio = "",
  ...props
}: PaperProps & { rawBio?: string }) {
  const iframeRef = useRef<HTMLIFrameElement>();
  const [height, setHeight] = useState(0);
  const [ready, setReady] = useState(false);
  const { classes } = useStyles();
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

  const UNSAFEhtml = marked.parse(rawBio || "");
  const safeHtml = DOMPurify.sanitize(UNSAFEhtml);

  return (
    <Paper withBorder p="sm" className={classes.paper} {...props}>
      {ready ? (
        <Frame
          style={{ height }}
          className={classes.frame}
          // @ts-ignore
          ref={iframeRef}
          scrolling="no"
          allowtransparency="true"
        >
          <FrameContextConsumer>
            {({ document }) => {
              const emotionCache = createEmotionCache({
                key: "bio",
                container: document?.head,
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
                  </MantineProvider>
                  <style>{NormalizeCSS}</style>
                  <base target="_blank" />
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
