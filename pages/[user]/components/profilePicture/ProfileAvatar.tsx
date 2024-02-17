import { Box, Image, useMantineTheme } from "@mantine/core";
import { IconUser } from "@tabler/icons-react";

import { EditingProfile } from "../customization/EditProfileModal";

import { getAssetURL } from "services/data";
import useUser from "services/firebase/user";

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
 * @param {EditingProfile} userInfo - The user's profile info
 * @param {number} size? - The size of the avatar
 * @param {string} border? - If the image needs a border, input the border style here
 */
function ProfileAvatar({
  userInfo,
  border,
  size = 120,
}: {
  userInfo?: EditingProfile;
  border?: string;
  size?: number;
}) {
  const theme = useMantineTheme();
  const user = useUser();

  const profile = userInfo || (user.loggedIn ? user.db : undefined);

  const placeholder = (
    <Box
      id="placeholder-icon"
      sx={{
        overflow: "hidden",
        boxSizing: "border-box",
        position: "relative",
        width: size,
        height: size,
        borderRadius: size,
        background: theme.colors[theme.primaryColor][1],
        border: border,
        textAlign: "center",
      }}
    >
      <IconUser
        size={size * 0.9}
        color={theme.colors[theme.primaryColor][3]}
        style={{ marginTop: 3 }}
      />
    </Box>
  );

  if (profile === undefined) return placeholder;

  const src =
    profile.profile__picture &&
    getAssetURL(
      `assets/card_still_full1_${Math.abs(profile.profile__picture.id)}_${
        profile.profile__picture.id > 0 ? "evolution" : "normal"
      }.png`
    );

  const crop = profile.profile__picture?.crop;

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
      width={transform.width}
      height={transform.height}
      styles={(theme) => ({
        root: {
          width: `${size}px !important`,
          height: size,
        },
        imageWrapper: {
          boxSizing: "border-box",
          position: "relative",
          width: size,
          height: size,
          overflow: "hidden",
          borderRadius: size,
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

  return src && crop && userInfo?.profile__picture?.id !== 0
    ? image
    : placeholder;
}

export default ProfileAvatar;
