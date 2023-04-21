import { Box, BoxProps } from "@mantine/core";

function ResponsiveGrid({
  width = 224,
  alignItems = "flex-start",
  ...props
}: { width?: number; alignItems?: string } & BoxProps) {
  return (
    <Box
      {...props}
      sx={[
        (theme) => ({
          display: "grid",
          gridTemplateColumns: `[s] repeat(auto-fill, minmax(${width}px, 1fr)) [e]`,
          gap: theme.spacing.xs,
          alignItems: alignItems,
          ...(props.sx as any),
        }),
      ]}
    />
  );
}

export default ResponsiveGrid;
