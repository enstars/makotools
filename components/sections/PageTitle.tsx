import { Box, Title } from "@mantine/core";
import { ReactElement } from "react";

function PageTitle({
  title = "",
  children = <></>,
  space = 64,
  mb = 8,
  sx,
}: {
  title?: string | ReactElement;
  children?: ReactElement;
  space?: number;
  mb?: number;
  sx?: any;
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
        {title}
      </Title>
    </Box>
  );
}

export default PageTitle;
