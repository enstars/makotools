import { Box, Group, Paper, Title, useMantineTheme } from "@mantine/core";
import { ReactNode } from "react";

function SectionTitle({
  title,
  id,
  Icon,
  iconProps,
}: {
  title: ReactNode;
  id?: string;
  Icon: any;
  iconProps?: any;
}) {
  const theme = useMantineTheme();
  return (
    <Paper
      p={0}
      mb={theme.spacing.sm}
      sx={{ overflow: "clip", marginTop: "5vh" }}
      shadow="xs"
    >
      <Group
        align="center"
        sx={{
          borderRadius: 4,
          width: "100%",
          gap: 12,
        }}
      >
        <Box
          p={0.5}
          pl={25}
          pr={10}
          ml={-10}
          sx={{
            flexShrink: 1,
            background: theme.colors[theme.primaryColor][7] + "b8",
            color:
              theme.colorScheme === "dark"
                ? theme.colors.dark[5]
                : theme.colors.gray[0],
            transform: "skew(-10deg)",
            boxShadow: theme.shadows.xs,
            borderRight: `0.5vw solid ${
              theme.colors[theme.primaryColor][
                theme.colorScheme === "dark" ? 9 : 1
              ]
            }${theme.colorScheme === "dark" ? "aa" : "cc"}`,
          }}
        >
          <Icon
            strokeWidth={1.25}
            size={40}
            style={{ opacity: 1, transform: "rotate(-5deg) skew(10deg)" }}
            {...iconProps}
          />
        </Box>
        <Title
          id={id}
          order={2}
          sx={{
            overflow: "visible",
            flexGrow: 1,
          }}
        >
          {title}
        </Title>
      </Group>
    </Paper>
  );
}

export default SectionTitle;
