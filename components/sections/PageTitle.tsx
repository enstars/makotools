import { Box, Title } from "@mantine/core";
import { ReactElement } from "react";

import { RegionSwitcher } from "./RegionInfo";

import { GameRegion } from "types/game";

function PageTitle({
  title = "",
  children = <></>,
  space = 64,
  mb = 8,
  sx,
  region,
}: {
  title?: string | ReactElement;
  children?: ReactElement;
  space?: number;
  mb?: number;
  sx?: any;
  region?: GameRegion;
}) {
  return (
    <Box sx={[{ position: "relative", overflow: "hidden" }, sx]}>
      {children}
      <Title
        order={1}
        mt={space}
        mb={mb}
        sx={{ zIndex: 10, position: "relative" }}
        inherit
      >
        {region && <RegionSwitcher />}
        {title}
      </Title>
    </Box>
  );
}

export default PageTitle;
