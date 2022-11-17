import {
  Stack,
  Box,
  ActionIcon,
  Paper,
  AspectRatio,
  Badge,
  Image,
  Switch,
  Text,
  NumberInput,
} from "@mantine/core";
import { IconX } from "@tabler/icons";
import Link from "next/link";
import { useState } from "react";

import { getAssetURL } from "services/data";
import { CollectedCard } from "types/makotools";

function CollectionCard({
  card,
  editing,
}: {
  card: CollectedCard;
  editing: boolean;
}) {
  const [checked, setChecked] = useState<boolean>(card.id > 0);
  const [amount, setAmount] = useState<number>(card.count);

  const editingProps = {
    component: Link,
    href: `/cards/${Math.abs(card.id)}`,
  };

  return (
    <Stack spacing="xs" justify="flex-start">
      <Box sx={{ position: "relative" }}>
        {editing && (
          <Box
            sx={{
              position: "absolute",
              top: 1,
              right: 1,
              zIndex: 3,
            }}
          >
            <ActionIcon variant="filled" color="dark" radius="lg">
              <IconX />
            </ActionIcon>
          </Box>
        )}
        {editing ? (
          <Box
            sx={{
              width: "50%",
              position: "absolute",
              bottom: 2,
              left: 2,
              zIndex: 3,
            }}
          >
            <NumberInput
              aria-label="Number of card copies"
              min={1}
              max={5}
              value={amount}
              onChange={(amt) => setAmount(amt as number)}
            />
          </Box>
        ) : (
          card.count > 1 && (
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
          )
        )}
        <Paper
          radius="sm"
          withBorder
          sx={{ position: "relative" }}
          {...editingProps}
        >
          <AspectRatio ratio={4 / 5}>
            <Image
              radius="sm"
              alt={"card image"}
              withPlaceholder
              src={getAssetURL(
                `assets/card_rectangle4_${Math.abs(card.id)}_${
                  card.id < 0 ? "normal" : "evolution"
                }.png`
              )}
            />
          </AspectRatio>
        </Paper>
      </Box>
      {editing && (
        <Switch
          checked={checked}
          aria-label="Set bloomed"
          onLabel="Bloomed"
          offLabel="Unbloomed"
          size="lg"
          onChange={(event) => {
            setChecked(event.currentTarget.checked);
            card.id = card.id * -1;
          }}
          sx={{ marginTop: 0 }}
        />
      )}
    </Stack>
  );
}

export default CollectionCard;
