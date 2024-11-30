import { createStyles } from "@mantine/core";

import IconTrickstar from "./IconTrickstar.svg";
import IconFine from "./IconFine.svg";
import IconUndead from "./IconUndead.svg";
import IconKnights from "./IconKnights.svg";
import IconRyuseitai from "./IconRyuseitai.svg";
import IconRabits from "./IconRabits.svg";
import Icon2Wink from "./Icon2Wink.svg";
import IconAkatsuki from "./IconAkatsuki.svg";
import IconValkyrie from "./IconValkyrie.svg";
import IconSwitch from "./IconSwitch.svg";
import IconMaM from "./IconMaM.svg";
import IconEden from "./IconEden.svg";
import IconAlkaloid from "./IconAlkaloid.svg";
import IconCrazyB from "./IconCrazyB.svg";

const idToIcon: { [n: number]: any } = {
  1: IconTrickstar,
  2: IconFine,
  3: IconUndead,
  4: IconKnights,
  5: IconRyuseitai,
  6: IconRabits,
  7: Icon2Wink,
  8: IconAkatsuki,
  9: IconValkyrie,
  10: IconSwitch,
  11: IconMaM,
  14: IconEden,
  15: IconAlkaloid,
  16: IconCrazyB,
  17: IconMaM,
};

const useStyles = createStyles(() => ({
  icon: {
    "& path": {
      fill: "transparent",
    },
  },
}));

function IconEnstars({
  unit,
  size = 24,
  ...props
}: {
  unit: number;
  size: number;
} & any) {
  const UnitIcon = idToIcon[unit];
  const { classes } = useStyles();
  if (!UnitIcon) return <></>;
  return (
    <UnitIcon
      viewBox="0 0 24 24"
      width={size}
      height={size}
      strokeWidth={2}
      className={classes.icon}
      {...props}
    />
  );
}

export default IconEnstars;
