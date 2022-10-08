import { IconBadge, IconBadgeOff } from "@tabler/icons";
import { Text, Tooltip } from "@mantine/core";

import useUser from "../../../services/firebase/user";
import { Lang } from "../../../types/makotools";

function OfficialityBadge({ langData }: { langData: Lang }) {
  const user = useUser();
  const showTlBadge =
    (!user.loading && user.loggedIn && user?.db?.setting__show_tl_badge) ||
    "none";

  if (langData.locale !== "en") return null;
  if (showTlBadge === "none") return null;
  if (showTlBadge === "unofficial" && langData.source) return null;

  return (
    <Text
      component="span"
      inherit
      inline
      color="dimmed"
      sx={{ verticalAlign: -2, lineHeight: 0 }}
    >
      <Tooltip
        label={`${langData.source ? "Official" : "Unofficial"} Translation`}
      >
        {langData.source ? (
          <IconBadge size="1em" />
        ) : (
          <IconBadgeOff size="1em" />
        )}
      </Tooltip>
    </Text>
  );
}

export default OfficialityBadge;
