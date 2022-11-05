import { Box, BoxProps } from "@mantine/core";

function ResponsiveGrid({
  width = 224,
  ...props
}: { width?: number } & BoxProps) {
  return (
    <Box
      {...props}
      sx={[
        (theme) => ({
          display: "grid",
          gridTemplateColumns: `[s] repeat(auto-fill, minmax(${width}px, 1fr)) [e]`,
          gap: theme.spacing.xs,
          alignItems: "flex-start",
          ...(props.sx as any),
        }),
      ]}
    />
  );
}

export default ResponsiveGrid;
