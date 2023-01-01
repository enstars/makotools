import { Box, Image, useMantineTheme } from "@mantine/core";
import { IconUser } from "@tabler/icons";

/** Type defining the width, height, x-coordinate, and y-coordinate of a crop
 * @param {number} x - x-coordinate
 * @param {number} y - y-coordinate
 * @param {number} width - width
 * @param {number} height - height
 */
interface Crop {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Component defining a profile picture referenced in ProfilePicModal, EditProfileModal, and the profile page
 * @param {string} src - The image source
 * @param {Crop} crop? - The image crop
 * @param {string} border? - If the image needs a border, input the border style here
 */
function ProfileAvatar({
  src,
  crop,
  border,
}: {
  src: string;
  crop?: Crop | undefined;
  border?: string;
}) {
  const theme = useMantineTheme();

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

  const placeholder = (
    <Box
      sx={{
        position: "relative",
        width: 120,
        height: 120,
        borderRadius: 60,
        background: theme.colors[theme.primaryColor][1],
        border: border,
        textAlign: "center",
      }}
    >
      <IconUser
        size={100}
        color={theme.colors[theme.primaryColor][3]}
        style={{ marginTop: 3 }}
      />
    </Box>
  );

  const image = (
    <Image
      src={src}
      alt="avatar"
      width={transform.width}
      height={transform.height}
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
          position: "absolute",
          top: 0,
          left: 0,
          transform: style.transform,
          transformOrigin: "top left",
          pointerEvents: "none",
        },
      })}
    />
  );

  return src && crop ? image : placeholder;
}

export default ProfileAvatar;
