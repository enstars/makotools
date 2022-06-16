import styled from "styled-components";
import Breadcrumbs from "./Header/Breadcrumbs";
import { Box, Title } from "@mantine/core";
function TitleApp({ title, children, space }) {
  return (
    <Box sx={{ position: "relative", overflow: "hidden" }}>
      {children}
      <Breadcrumbs />
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
