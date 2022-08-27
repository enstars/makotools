import { Box, Title } from "@mantine/core";

import Breadcrumbs from "../Layout/Header/Breadcrumbs";

function PageTitle({ title = "", children = <></>, space = 64, mb = 8 }) {
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
