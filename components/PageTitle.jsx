import Breadcrumbs from "./Layout/Header/Breadcrumbs";
import { Box, Title } from "@mantine/core";

function TitleApp({ title, children, space, getBreadcrumbs }) {
  return (
    <Box sx={{ position: "relative", overflow: "hidden" }}>
      {children}
      <Breadcrumbs getBreadcrumbs={getBreadcrumbs} />
      <Title
        order={1}
        mt={space || 64}
        mb={8}
        sx={{ zIndex: 10, position: "relative" }}
      >
        {title}
      </Title>
    </Box>
  );
}

export default TitleApp;
