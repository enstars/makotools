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
import Image, { ImageProps } from "next/future/image";
import { ImageProps as MantineImageProps } from "@mantine/core";
import { SyntheticEvent, useState } from "react";
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

import { getAssetURL } from "../../services/data";
import { downloadFromURL } from "../../services/utilities";
import notify from "../../services/libraries/notify";
import { CONSTANTS } from "../../services/makotools/constants";

import useUser from "services/firebase/user";

interface PictureProps extends NextMantineImageProps {
  action?: "none" | "view" | "download";
  srcB2?: string;
  src?: string;
  transparent?: boolean;
}

const useStyles = createStyles(
  (
    theme,
    { radius, placeholderURL }: MantineImageProps & { placeholderURL?: string },
    getRef
  ) => ({
    picture: {
      position: "relative",
      display: "block",
      "&, source, img": {
        color: "transparent",
        background: "transparent",
      },
    },
    placeholder: {
      display: "block",
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: radius,
      overflow: "hidden",
      zIndex: 0,
      pointerEvents: "none",
      transition: theme.other.transition,
      "::before, ::after": {
        content: "''",
        display: "block",
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      },
      "::before": {
        background: `no-repeat center/cover url(${placeholderURL})`,
        filter: "saturate(160%) blur(0px)",
        // animation: `${flash} 1s ease-in-out infinite`,
      },
      "::after": {
        backdropFilter: "blur(15px)",
      },
    },
    placeholderLoaded: {
      opacity: 0,
    },
    img: {
      borderRadius: radius,
      objectFit: "cover",
      maxWidth: "100%",
      opacity: 0,
      transition: theme.other.transition,
    },
    loadedImg: {
      opacity: 1,
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
    actionIconRoot: {
      background: theme.colors.dark[9] + "77",
      color: theme.white,
      ":hover": {
        background: theme.colors.dark[9] + "BB",
      },
      backdropFilter: "blur(5px)",
    },
  })
);

function Picture({
  children,
  ...props
}: Omit<PictureProps, "src"> & { src?: string }) {
  const {
    src: originalSrc,
    srcB2,
    alt,
    sx,
    styles,
    className,
    action = "none",
    transparent = false,
    ...otherProps
  } = props;
  const theme = useMantineTheme();
  const user = useUser();

  const dontUseWebP =
    (user.loggedIn && user.db.setting__use_webp === "dont-use") || false;

  const [loaded, setLoaded] = useState<boolean>(false);
  const [opened, setOpened] = useState<boolean>(false);

  const src = originalSrc || getAssetURL(srcB2 as string);
  const isB2Optimized = !!srcB2;

  const webpSrc = src?.replace("png", "webp");
  const downloadLink = src + "?download";

  const downloadFile = (event: SyntheticEvent) => {
    event.stopPropagation();
    downloadFromURL(downloadLink);
  };

  const hasPlaceholder = isB2Optimized && !transparent;
  const placeholderURL = hasPlaceholder
    ? src?.replace(".png", "-placeholder.jpg")
    : undefined;

  const { classes, cx } = useStyles({
    radius:
      typeof props.radius === "string"
        ? theme.radius[props.radius]
        : props.radius,
    placeholderURL,
  });

  return (
    <>
      <Box
        component="picture"
        sx={sx}
        styles={styles}
        className={cx(classes.picture, className)}
      >
        {hasPlaceholder && <div className={classes.placeholder} />}
        {!dontUseWebP && <source srcSet={webpSrc} />}
        <Image
          unoptimized
          fill
          sizes="100vw"
          placeholder="empty"
          src={src}
          alt={alt}
          onContextMenu={() => {
            if ((isB2Optimized || webpSrc) && !dontUseWebP)
              notify("info", {
                title: "This is a WEBP file!",
                message:
                  "We recommend you use the download / view file button on the bottom right to get an uncompressed PNG file. Alternatively, you can also disable WEBPs entirely in Settings.",
              });
          }}
          onLoadingComplete={() => setLoaded(true)}
          {...otherProps}
          className={cx(
            classes.img,
            className,
            loaded ? classes.loadedImg : ""
          )}
        />
        {action === "download" && (
          <ActionIcon
            size="sm"
            sx={{ position: "absolute", right: 4, bottom: 4 }}
            onClick={downloadFile}
            component="a"
            className={classes.actionIconRoot}
          >
            <IconDownload size={14} />
          </ActionIcon>
        )}
        {action === "view" && (
          <>
            <ActionIcon
              size="sm"
              sx={{ position: "absolute", right: 4, bottom: 4 }}
              onClick={(event: SyntheticEvent) => {
                event.stopPropagation();
                setOpened((o) => !o);
              }}
              className={classes.actionIconRoot}
            >
              <IconArrowsDiagonal size={14} />
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
                {({ zoomIn, zoomOut, centerView }) => (
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
                        spacing={2}
                        sx={{
                          position: "absolute",
                          zIndex: 10,
                          bottom: 4,
                          right: 4,
                        }}
                      >
                        <ActionIcon
                          className={classes.actionIconRoot}
                          onClick={() => zoomIn()}
                        >
                          <IconZoomIn size={16} />
                        </ActionIcon>
                        <ActionIcon
                          className={classes.actionIconRoot}
                          onClick={() => zoomOut()}
                        >
                          <IconZoomOut size={16} />
                        </ActionIcon>
                        <ActionIcon
                          className={classes.actionIconRoot}
                          onClick={() => centerView(0.95)}
                        >
                          <IconFocusCentered size={16} />
                        </ActionIcon>
                      </Stack>
                      <TransformComponent
                        wrapperClass={classes.tcWrapper}
                        contentClass={classes.tcContent}
                      >
                        <MantineImage
                          src={src}
                          alt={""}
                          classNames={{ root: classes.modalImage }}
                          height="100%"
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
