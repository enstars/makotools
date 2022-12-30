import { Box, Title, useMantineTheme } from "@mantine/core";

function SectionTitle({
  title,
  id,
  Icon,
}: {
  title: string;
  id: string;
  Icon: any;
}) {
  const theme = useMantineTheme();
  return (
    <Title
      id={id}
      order={2}
      sx={{ position: "relative", overflow: "visible" }}
      mt={32}
      mb="lg"
    >
      {title}
      <Box
        sx={(theme) => ({
          position: "absolute",
          zIndex: -2,
          opacity: 0.3,
          bottom: -20,
          left: -32,
          transform: "rotate(-5deg)",
          color: theme.colors[theme.primaryColor][5],
        })}
      >
        <Icon strokeWidth={1.25} size={64} style={{ opacity: 1 }} />
      </Box>
    </Title>
  );
}

export default SectionTitle;
