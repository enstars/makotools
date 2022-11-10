import { Box, Space, Title } from "@mantine/core";

function SectionTitle({
  title,
  id,
  icon,
}: {
  title: string;
  id: string;
  icon: any;
}) {
  return (
    <>
      <Space h="xl" />
      <Box sx={{ position: "relative", width: "100%", height: 70 }}>
        <Title
          id={id}
          order={2}
          sx={{ position: "absolute", top: "25%", left: "7%" }}
        >
          {title}
        </Title>
        <Box
          sx={{
            position: "absolute",
            left: 0,
            top: 0,
            zIndex: -2,
            opacity: 0.15,
          }}
        >
          {icon}
        </Box>
      </Box>
      <Space h="xl" />
    </>
  );
}

export default SectionTitle;
