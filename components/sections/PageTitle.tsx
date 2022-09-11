import { Box, Title } from "@mantine/core";
import { ReactElement } from "react";

import Breadcrumbs from "../Layout/Header/Breadcrumbs";

function PageTitle({
  title = "",
  children = <></>,
  space = 64,
  mb = 8,
}: {
  title?: string | ReactElement;
  children?: ReactElement;
  space?: number;
  mb?: number;
}) {
  return (
    <Box sx={{ position: "relative", overflow: "hidden" }}>
      {children}
      <Title
        order={1}
        mt={space}
        mb={mb}
        sx={{ zIndex: 10, position: "relative" }}
      >
        {title}
      </Title>
    </Box>
  );
}

export default PageTitle;
