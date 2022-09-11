import { useState, ReactElement, SyntheticEvent } from "react";
import {
  Modal,
  Text,
  Image as MantineImage,
  Paper,
  useMantineTheme,
  Button,
  UnstyledButton,
  Box,
  createStyles,
  ImageStylesParams,
  ImageProps,
  CSSObject,
} from "@mantine/core";
import { IconArrowUpRightCircle, IconArrowsDiagonal } from "@tabler/icons";
import { merge } from "lodash";

import { CONSTANTS } from "../../services/constants";

const useStyles = createStyles((theme, { radius }: ImageProps, getRef) => ({
  figure: {
    [`&:hover .${getRef("backdrop")}`]: {
      backgroundPositionY: 70,
    },
    [`&:hover .${getRef("button")}`]: {
      opacity: 0.7,

      "&:hover": {
        opacity: 1,
      },
    },
  },

  backdrop: {
    ref: getRef("backdrop"),
    position: "absolute",
    right: 0,
    bottom: 0,
    background:
      "70px 50px / 120% 120% no-repeat radial-gradient(#000F 15%, transparent 60%)",
    padding: 5,
    paddingBottom: 3,
    zIndex: 14,
    width: 160,
    height: 120,
    pointerEvents: "none",
    backgroundPositionY: 140,
    transition: theme.other.transition,
    borderBottomRightRadius:
      typeof radius === "string" ? theme.radius?.[radius] : radius,
  },
  button: {
    ref: getRef("button"),
    position: "absolute",
    right: 0,
    bottom: 0,
    padding: 5,
    paddingBottom: 3,
    zIndex: 15,
    opacity: 0,
    transition: theme.other.transition,
  },
}));

function ImageViewer({ caption = <></>, styles = {}, ...props }: ImageProps) {
  const [opened, setOpened] = useState(false);
  const theme = useMantineTheme();
  const { classes } = useStyles({ radius: props?.radius });
  return (
    <>
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
              {props?.src?.replace(CONSTANTS.EXTERNAL_URLS.ASSETS, "") ||
                "Save Image"}
            </Text>
            <Text size="sm" color="dimmed">
              Save the image below to get a high resolution version.
            </Text>
          </>
        }
        styles={{ header: { alignItems: "flex-start", marginRight: 0 } }}
      >
        <Button
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
          <MantineImage
            src={props.src}
            alt={props.alt || "Image"}
            withPlaceholder
            styles={{ image: { minHeight: 100 } }}
          ></MantineImage>
        </Paper>
      </Modal>
      <MantineImage
        classNames={{
          figure: classes.figure,
        }}
        styles={merge(
          {
            caption: {
              margin: 0,
            },
            root: {
              display: "flex",
            },
          },
          styles
        )}
        caption={
          <>
            <Box className={classes.backdrop} component="span" />
            <UnstyledButton
              className={classes.button}
              onClick={(event: SyntheticEvent) => {
                event.stopPropagation();
                setOpened(true);
              }}
            >
              <IconArrowsDiagonal size={16} color="white" strokeWidth={2.5} />
            </UnstyledButton>
            {caption}
          </>
        }
        {...props}
      />
    </>
  );
}

export default ImageViewer;
