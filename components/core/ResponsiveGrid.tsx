import { Box, BoxProps } from "@mantine/core";

function ResponsiveGrid({
  width = 224,
  alignItems = "flex-start",
  gap = "xs",
  ...props
}: {
  width?: number | string;
  alignItems?: string;
  gap?: "xs" | "sm" | "md" | "lg" | "xl";
} & BoxProps) {
  return (
    <Box
      {...props}
      sx={[
        (theme) => ({
          display: "grid",
          gridTemplateColumns: `[s] repeat(auto-fill, minmax(${
            isNaN(width as number) ? width : `${width}px`
          }, 1fr)) [e]`,
          gap: theme.spacing[gap],
          alignItems: alignItems,
          ...(props.sx as any),
        }),
      ]}
    />
  );
}

export default ResponsiveGrid;
