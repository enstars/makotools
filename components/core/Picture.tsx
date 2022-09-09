import { Box } from "@mantine/core";
import Image, { ImageProps } from "next/future/image";

function Picture({ src, alt, ...props }: ImageProps) {
  return (
    <Box component="picture">
      <source srcSet="/images/cereal-box.webp" />
      <Image src="/images/cereal-box.jpg" alt={alt} />
    </Box>
  );
}

export default Picture;
