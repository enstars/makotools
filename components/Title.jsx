import styled from "styled-components";
import Breadcrumbs from "./Header/Breadcrumbs";
import { Box, Title } from "@mantine/core";
function TitleApp({ title, children }) {
  return (
    <Box sx={{ position: "relative", overflow: "hidden" }}>
      <Breadcrumbs />
      <Title order={1} mt={64} mb={8}>
        {title}
      </Title>
    </Box>
  );
}
export default TitleApp;
