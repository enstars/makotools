import { useState, useEffect, useRef } from "react";
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
} from "@mantine/core";
import { IconDownload, IconArrowUpRightCircle } from "@tabler/icons";

const useStyles = createStyles((theme, _params, getRef) => ({
  figure: {
    [`&:hover .${getRef("backdrop")}`]: {
      // transform: "translateY(0)",
      backgroundPositionY: 70,
    },
    [`&:hover .${getRef("button")}`]: {
      // transform: "translateY(0)",
      opacity: 0.7,

      "&:hover": {
        opacity: 1,
      },
    },
    // overflow: "hidden",
    // position: "relative",
  },

  backdrop: {
    ref: getRef("backdrop"),
    position: "absolute",
    right: 0,
    bottom: 0,
    background:
      "70px 50px / 120% 120% no-repeat radial-gradient(#000F 15%, transparent 60%)",
    // background: "blue",
    padding: 5,
    paddingBottom: 3,
    zIndex: 14,
    width: 160,
    height: 120,
    pointerEvents: "none",
    // transform: "translateY(32px)",
    backgroundPositionY: 140,
    transition: theme.other.transition,
    borderBottomRightRadius: 3,
  },
  button: {
    ref: getRef("button"),
    position: "absolute",
    right: 0,
    bottom: 0,
    // background: "radial-gradient(#000F, transparent 50%)",
    // background: "blue",
    padding: 5,
    paddingBottom: 3,
    zIndex: 15,
    opacity: 0,
    transition: theme.other.transition,
  },
}));

function ImageViewer({ caption, ...props }) {
  const [opened, setOpened] = useState(false);
  const theme = useMantineTheme();
  const { classes } = useStyles();
  return (
    <>
      <Modal
        size="lg"
        // overflow="inside"
        opened={opened}
        onClose={() => {
          setOpened(false);
          // console.log("closed modal");
        }}
        centered
        onClick={(e) => {
          // e.preventDefault();
          e.stopPropagation();
          // e.nativeEvent.stopImmediatePropagation();
        }}
        title={
          <>
            <Text weight="500">
              {props.src.replace("https://assets.ensemble.link/", "") ||
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
        caption={
          <>
            <Box className={classes.backdrop} component="span" />
            <UnstyledButton
              className={classes.button}
              onClick={(e) => {
                e.stopPropagation();
                setOpened(true);
              }}
            >
              <IconDownload size={16} color="white" strokeWidth={2.5} />
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
