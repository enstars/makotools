import { Image } from "@mantine/core";

interface Crop {
  x: number;
  y: number;
  width: number;
  height: number;
}

function ProfileAvatar({
  src,
  crop,
  border,
}: {
  src: string;
  crop?: Crop | undefined;
  border?: string;
}) {
  const scale: number = crop ? 100 / crop.width : 100;

  const transform = {
    x: `${crop ? -crop.x * scale : scale}%`,
    y: `${crop ? -crop.y * scale : scale}%`,
    scale,
    width: "calc(100% + 0.5px)",
    height: "auto",
  };

  const style = {
    transform: `translate(${transform.x}, ${transform.y}) scale(${transform.scale},${transform.scale})`,
  };

  const image = (
    <Image
      src={src}
      alt="avatar"
      width={crop ? transform.width : 120}
      height={crop ? transform.height : 120}
      styles={(theme) => ({
        root: {
          width: "120px !important",
          height: 120,
        },
        imageWrapper: {
          position: "relative",
          width: 120,
          height: 120,
          overflow: "hidden",
          borderRadius: 60,
          border: border || "none",
        },
        image: {
          position: crop ? "absolute" : "static",
          top: crop ? 0 : undefined,
          left: crop ? 0 : undefined,
          transform: crop ? style.transform : undefined,
          transformOrigin: crop ? "top left" : undefined,
        },
      })}
    />
  );

  return image;
}

export default ProfileAvatar;
