import { useState } from "react";
import {
  Modal,
  Text,
  Image as MantineImage,
  Paper,
  useMantineTheme,
} from "@mantine/core";
import Image from "next/image";

function ImageViewer({ src, alt, ...props }) {
  const [opened, setOpened] = useState(false);
  const theme = useMantineTheme();
  return (
    <>
      <Modal
        size="lg"
        // overflow="inside"
        opened={opened}
        onClose={() => setOpened(false)}
        // centered
        title={
          <>
            <Text weight="500">Save Image</Text>
            <Text size="sm" color="dimmed">
              Save the image below to get a high resolution version of the
              image.
            </Text>
          </>
        }
        styles={{ header: { alignItems: "flex-start", marginRight: 0 } }}
      >
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
            src={src}
            alt={alt}
            withPlaceholder
            styles={{ image: { minHeight: 100 } }}
          ></MantineImage>
        </Paper>
      </Modal>
      <Image src={src} alt={alt} onClick={() => setOpened(true)} {...props} />
    </>
  );
}

export default ImageViewer;
