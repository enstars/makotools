import {
  Box,
  Button,
  createStyles,
  Modal,
  Paper,
  useMantineTheme,
  Image as MantineImage,
  Text,
  ActionIcon,
  Group,
  Stack,
} from "@mantine/core";
import Image, { ImageProps, StaticImageData } from "next/future/image";
import { ImageProps as MantineImageProps } from "@mantine/core";
import { useState } from "react";
import {
  IconArrowsDiagonal,
  IconArrowUpRightCircle,
  IconDownload,
  IconFocusCentered,
  IconZoomIn,
  IconZoomOut,
} from "@tabler/icons";
import Link from "next/link";
import {
  TransformComponent,
  TransformWrapper,
} from "@pronestor/react-zoom-pan-pinch";
// } from "@pronestor/react-zoom-pan-pinch";

import { getB2File } from "../../services/ensquare";
import { downloadFromURL } from "../../services/utilities";
import notify from "../../services/notify";
import { CONSTANTS } from "../../services/constants";

function loader({ src }) {
  return src;
}

const useStyles = createStyles(
  (theme, { radius }: MantineImageProps, getRef) => ({
    picture: {
      position: "relative",
      display: "block",
    },
    img: {
      borderRadius: radius,
      objectFit: "cover",
      maxWidth: "100%",
    },
    radius: {
      borderRadius: radius,
    },
    modalBody: {
      overflow: "visible",
      display: "flex",
      flexDirection: "column",
      height: "100vh",
    },
    modalImage: {
      "div img": {
        pointerEvents: "all",
      },
    },
    tcWrapper: { width: "100%" },
    tcContent: { width: "100%" },
  })
);
interface PictureProps extends NextMantineImageProps {
  action?: "none" | "view" | "download";
  srcB2?: string;
  src?: string | StaticImageData;
}

function Picture(props: PictureProps) {
  const theme = useMantineTheme();
  const { classes, cx } = useStyles({
    radius:
      typeof props.radius === "string"
        ? theme.radius[props.radius]
        : props.radius,
  });

  const [opened, setOpened] = useState<boolean>(false);

  if (typeof props.src !== "undefined" && typeof props.src !== "string") {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <Image {...(props as ImageProps)} />;
  }

  const {
    src: originalSrc,
    srcB2,
    alt,
    sx,
    styles,
    className,
    children,
    action = "none",
  } = props;

  const src = originalSrc || getB2File(srcB2 as string);
  const isB2Optimized = !!srcB2;

  const webpSrc = src?.replace("png", "webp");
  const downloadLink = src + "?download";

  const downloadFile = () => {
    downloadFromURL(downloadLink);
  };

  return (
    <>
      <Box
        component="picture"
        sx={sx}
        styles={styles}
        className={cx(classes.picture)}
      >
        <source srcSet={webpSrc} />
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <Image
          loader={loader}
          fill
          // width={10}
          // height={10}
          src={src}
          className={cx(classes.img, className)}
          onContextMenu={() => {
            if (isB2Optimized || webpSrc)
              notify("info", {
                title: "This is a WEBP file!",
                message:
                  "We recommend you use the download / view file button on the bottom right to get an uncompressed PNG file. Alternatively, you can also disable WEBPs entirely in Settings.",
              });
          }}
          {...props}
        />
        {action === "download" && (
          <ActionIcon
            sx={{ position: "absolute", right: 4, bottom: 4 }}
            onClick={downloadFile}
            component="a"
          >
            <IconDownload size={16} />
          </ActionIcon>
        )}
        {action === "view" && (
          <>
            <ActionIcon
              variant="light"
              color="dark"
              sx={{ position: "absolute", right: 4, bottom: 4, color: "white" }}
              onClick={() => setOpened((o) => !o)}
            >
              <IconArrowsDiagonal size={16} />
            </ActionIcon>
            <Modal
              size="lg"
              opened={opened}
              onClose={() => {
                setOpened(false);
              }}
              centered
              onClick={(e) => {
                e.stopPropagation();
              }}
              title={
                <>
                  <Text weight="500">
                    {src?.replace(CONSTANTS.EXTERNAL_URLS.ASSETS, "") ||
                      "Save Image"}
                  </Text>
                  <Text size="sm" color="dimmed">
                    {alt}
                  </Text>
                </>
              }
              styles={{
                header: { alignItems: "flex-start", marginRight: 0 },
              }}
              classNames={{
                body: classes.modalBody,
              }}
              overflow="inside"
            >
              <Text size="xs" color="dimmed" mb="xs">
                The image may appear blurry on Safari; Open or Download the
                image to view in full resolution!
              </Text>
              <TransformWrapper
                centerOnInit={true}
                centerZoomedOut={true}
                minScale={0.9}
                maxScale={12}
                initialScale={0.95}
                minPositionY={20}
                panning={{ velocityDisabled: true }}
              >
                {({ zoomIn, zoomOut, centerView, ...rest }) => (
                  <>
                    <Paper
                      radius="md"
                      withBorder
                      sx={{
                        overflow: "hidden",
                        position: "relative",
                        background:
                          "repeating-conic-gradient(#00000010 0% 25%, transparent 0% 50%) 50%",
                        backgroundSize: "1.75em 1.75em",
                        "&, *": {
                          display: "flex",
                          flexDirection: "column",
                          minHeight: 0,
                          flexGrow: 1,
                        },
                      }}
                    >
                      <Stack
                        position="center"
                        spacing={2}
                        sx={{
                          position: "absolute",
                          zIndex: 10,
                          bottom: 4,
                          right: 4,
                        }}
                      >
                        <ActionIcon onClick={() => zoomIn()}>
                          <IconZoomIn size={16} />
                        </ActionIcon>
                        <ActionIcon onClick={() => zoomOut()}>
                          <IconZoomOut size={16} />
                        </ActionIcon>
                        <ActionIcon onClick={() => centerView(0.95)}>
                          <IconFocusCentered size={16} />
                        </ActionIcon>
                      </Stack>
                      <TransformComponent
                        wrapperClass={classes.tcWrapper}
                        contentClass={classes.tcContent}
                      >
                        <MantineImage
                          // component="img"
                          src={src}
                          alt={""}
                          //   withPlaceholder
                          classNames={{ root: classes.modalImage }}
                          height="100%"
                          //   width="auto"
                          fit="contain"
                        />
                      </TransformComponent>
                    </Paper>

                    <Group mt="xs" position="apart">
                      <Box />
                      <Group spacing="xs">
                        <Link href={src} passHref target="_blank">
                          <Button
                            variant="light"
                            leftIcon={<IconArrowUpRightCircle size={16} />}
                          >
                            Open
                          </Button>
                        </Link>
                        <Button
                          leftIcon={<IconDownload size={16} />}
                          onClick={downloadFile}
                        >
                          Download
                        </Button>
                      </Group>
                    </Group>
                  </>
                )}
              </TransformWrapper>

              {/* <Button
                component="a"
                href={props.src}
                target="_blank"
                mb="xs"
                sx={{ width: "100%" }}
                variant="outline"
                leftIcon={<IconArrowUpRightCircle size="18" />}
              >
                Open Image In New Tab
              </Button>
              <Paper
                radius="sm"
                withBorder
                sx={{
                  background:
                    "repeating-conic-gradient(#00000010 0% 25%, transparent 0% 50%) 50%",
                  backgroundSize: "1.75em 1.75em",
                }}
              >
                <Image
                  src={props.src}
                  alt={props.alt || "Image"}
                  withPlaceholder
                  styles={{ image: { minHeight: 100 } }}
                ></Image>
              </Paper> */}
            </Modal>
          </>
        )}
        {children}
      </Box>
    </>
  );
}

export default Picture;

type NextMantineImageProps = Omit<
  MantineImageProps,
  | "src"
  | "alt"
  | "onAbort"
  | "onAbortCapture"
  | "onAnimationEnd"
  | "onAnimationEndCapture"
  | "onAnimationIteration"
  | "onAnimationIterationCapture"
  | "onAnimationStart"
  | "onAnimationStartCapture"
  | "onAuxClick"
  | "onAuxClickCapture"
  | "onBeforeInput"
  | "onBeforeInputCapture"
  | "onBlur"
  | "onBlurCapture"
  | "onCanPlay"
  | "onCanPlayCapture"
  | "onCanPlayThrough"
  | "onCanPlayThroughCapture"
  | "onChange"
  | "onChangeCapture"
  | "onClick"
  | "onClickCapture"
  | "onCompositionEnd"
  | "onCompositionEndCapture"
  | "onCompositionStart"
  | "onCompositionStartCapture"
  | "onCompositionUpdate"
  | "onCompositionUpdateCapture"
  | "onContextMenu"
  | "onContextMenuCapture"
  | "onCopy"
  | "onCopyCapture"
  | "onCut"
  | "onCutCapture"
  | "onDoubleClick"
  | "onDoubleClickCapture"
  | "onDrag"
  | "onDragCapture"
  | "onDragEnd"
  | "onDragEndCapture"
  | "onDragEnter"
  | "onDragEnterCapture"
  | "onDragExit"
  | "onDragExitCapture"
  | "onDragLeave"
  | "onDragLeaveCapture"
  | "onDragOver"
  | "onDragOverCapture"
  | "onDragStart"
  | "onDragStartCapture"
  | "onDrop"
  | "onDropCapture"
  | "onDurationChange"
  | "onDurationChangeCapture"
  | "onEmptied"
  | "onEmptiedCapture"
  | "onEncrypted"
  | "onEncryptedCapture"
  | "onEnded"
  | "onEndedCapture"
  | "onError"
  | "onErrorCapture"
  | "onFocus"
  | "onFocusCapture"
  | "onGotPointerCapture"
  | "onGotPointerCaptureCapture"
  | "onInput"
  | "onInputCapture"
  | "onInvalid"
  | "onInvalidCapture"
  | "onKeyDown"
  | "onKeyDownCapture"
  | "onKeyPress"
  | "onKeyPressCapture"
  | "onKeyUp"
  | "onKeyUpCapture"
  | "onLoad"
  | "onLoadCapture"
  | "onLoadStart"
  | "onLoadStartCapture"
  | "onLoadedData"
  | "onLoadedDataCapture"
  | "onLoadedMetadata"
  | "onLoadedMetadataCapture"
  | "onLostPointerCapture"
  | "onLostPointerCaptureCapture"
  | "onMouseDown"
  | "onMouseDownCapture"
  | "onMouseEnter"
  | "onMouseLeave"
  | "onMouseMove"
  | "onMouseMoveCapture"
  | "onMouseOut"
  | "onMouseOutCapture"
  | "onMouseOver"
  | "onMouseOverCapture"
  | "onMouseUp"
  | "onMouseUpCapture"
  | "onPaste"
  | "onPasteCapture"
  | "onPause"
  | "onPauseCapture"
  | "onPlay"
  | "onPlayCapture"
  | "onPlaying"
  | "onPlayingCapture"
  | "onPointerCancel"
  | "onPointerCancelCapture"
  | "onPointerDown"
  | "onPointerDownCapture"
  | "onPointerEnter"
  | "onPointerEnterCapture"
  | "onPointerLeave"
  | "onPointerLeaveCapture"
  | "onPointerMove"
  | "onPointerMoveCapture"
  | "onPointerOut"
  | "onPointerOutCapture"
  | "onPointerOver"
  | "onPointerOverCapture"
  | "onPointerUp"
  | "onPointerUpCapture"
  | "onProgress"
  | "onProgressCapture"
  | "onRateChange"
  | "onRateChangeCapture"
  | "onReset"
  | "onResetCapture"
  | "onScroll"
  | "onScrollCapture"
  | "onSeeked"
  | "onSeekedCapture"
  | "onSeeking"
  | "onSeekingCapture"
  | "onSelect"
  | "onSelectCapture"
  | "onStalled"
  | "onStalledCapture"
  | "onSubmit"
  | "onSubmitCapture"
  | "onSuspend"
  | "onSuspendCapture"
  | "onTimeUpdate"
  | "onTimeUpdateCapture"
  | "onTouchCancel"
  | "onTouchCancelCapture"
  | "onTouchEnd"
  | "onTouchEndCapture"
  | "onTouchMove"
  | "onTouchMoveCapture"
  | "onTouchStart"
  | "onTouchStartCapture"
  | "onTransitionEnd"
  | "onTransitionEndCapture"
  | "onVolumeChange"
  | "onVolumeChangeCapture"
  | "onWaiting"
  | "onWaitingCapture"
  | "onWheel"
  | "onWheelCapture"
  | "placeholder"
> &
  Omit<ImageProps, "src">;
