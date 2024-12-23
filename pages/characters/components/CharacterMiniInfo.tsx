import { Box, Text, Group, Divider } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

export function CharacterMiniInfo({
  label,
  info,
}: {
  label: string;
  info: string | number | JSX.Element;
}) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  return (
    <Group noWrap spacing="xs">
      <Text
        fz={isMobile ? "sm" : "md"}
        sx={(theme) => ({
          fontWeight: "bold",
          paddingLeft: 10,
          borderLeft: `4px solid ${
            theme.colorScheme === "dark"
              ? theme.colors.dark[4]
              : theme.colors.gray[9]
          }`,
        })}
      >
        {label}
      </Text>
      <Box
        sx={{
          "&": {
            flexGrow: 1,
          },
        }}
      >
        <Divider
          variant="dotted"
          size="md"
          sx={(theme) => ({
            borderColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[4]
                : theme.colors.gray[9],
          })}
        />
      </Box>
      <Text
        fz={isMobile ? "sm" : "md"}
        sx={{
          flexBasis: "50%",
        }}
      >
        {info}
      </Text>
    </Group>
  );
}
