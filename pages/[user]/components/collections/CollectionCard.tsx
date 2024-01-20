import { Box, Paper, AspectRatio, Badge, Image, Text } from "@mantine/core";
import Link from "next/link";

import { getAssetURL } from "services/data";
import { CollectedCard } from "types/makotools";

function CollectionCard({ card }: { card: CollectedCard }) {
  const editingProps = {
    component: Link,
    href: `/cards/${Math.abs(card.id)}`,
  };
  return (
    <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
      {card.count > 1 && (
        <Badge
          sx={{ position: "absolute", bottom: 4, left: 4, zIndex: 3 }}
          variant="filled"
        >
          <Text inline size="xs" weight="700">
            {card.count}
            <Text
              component="span"
              sx={{ verticalAlign: "-0.05em", lineHeight: 0 }}
            >
              ×
            </Text>
          </Text>
        </Badge>
      )}
      <Paper radius="sm" withBorder sx={{ position: "relative" }}>
        <AspectRatio ratio={4 / 5}>
          <Image
            alt={"card image"}
            withPlaceholder
            src={getAssetURL(
              `assets/card_rectangle4_${Math.abs(card.id)}_${
                card.id < 0 ? "normal" : "evolution"
              }.png`
            )}
            sx={(theme) => ({
              borderRadius: `${theme.radius.sm}px ${theme.radius.sm}px 0px 0px`,
            })}
            {...editingProps}
          />
        </AspectRatio>
      </Paper>
    </Box>
  );
}

export default CollectionCard;
