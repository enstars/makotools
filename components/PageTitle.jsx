import { Box, Title } from "@mantine/core";

import Breadcrumbs from "./Layout/Header/Breadcrumbs";

function PageTitle({ title, children, space, mb = 8, getBreadcrumbs }) {
  return (
    <Box sx={{ position: "relative", overflow: "hidden" }}>
      {children}
      {/* <Breadcrumbs getBreadcrumbs={getBreadcrumbs} /> */}
      <Title
        order={1}
        mt={space || 64}
        mb={mb}
        sx={{ zIndex: 10, position: "relative" }}
      >
        {title}
      </Title>
    </Box>
  );
}

export default PageTitle;
