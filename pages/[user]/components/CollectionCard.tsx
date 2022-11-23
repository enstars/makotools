import {
  Box,
  ActionIcon,
  Paper,
  AspectRatio,
  Badge,
  Image,
  Switch,
  Text,
  NumberInput,
  createStyles,
} from "@mantine/core";
import { IconX } from "@tabler/icons";
import Link from "next/link";
import { useState } from "react";

import { getAssetURL } from "services/data";
import { CollectedCard } from "types/makotools";

const useStyles = createStyles((theme) => ({
  switchRoot: {
    height: "30px",
    position: "relative",
  },

  switchInput: {
    display: "none",
  },

  switchBody: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
  },

  switchTrack: {
    width: "100%",
    borderRadius: `0px 0px ${theme.radius.sm}px ${theme.radius.sm}px`,
  },

  switchTrackLabel: {
    fontSize: "9pt",
  },

  switchThumb: {
    borderRadius: theme.radius.sm,
    fontWeight: 400,
  },
}));

function CollectionCard({
  card,
  editing,
}: {
  card: CollectedCard;
  editing: boolean;
}) {
  const { classes } = useStyles();
  const [checked, setChecked] = useState<boolean>(card.id > 0);
  const [amount, setAmount] = useState<number>(card.count);

  const editingProps = {
    component: Link,
    href: `/cards/${Math.abs(card.id)}`,
  };

  return (
    <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
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
            bottom: 33,
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
      <Paper radius="sm" withBorder sx={{ position: "relative" }}>
        <AspectRatio ratio={4 / 5}>
          {editing ? (
            <Box sx={{ position: "relative" }}>
              <Image
                alt={"card image"}
                withPlaceholder
                src={getAssetURL(
                  `assets/card_rectangle4_${Math.abs(card.id)}_normal.png`
                )}
                sx={{
                  position: "absolute",
                  top: 0,
                  left: card.id < 0 ? "auto" : 120,
                  borderRadius: "4px 4px 0px 0px",
                  transition: "left 0.2s linear",
                  MozTransition: "left 0.2s linear",
                }}
                {...editingProps}
              />
              <Image
                alt={"card image"}
                withPlaceholder
                src={getAssetURL(
                  `assets/card_rectangle4_${Math.abs(card.id)}_evolution.png`
                )}
                sx={{
                  position: "absolute",
                  top: 0,
                  right: card.id > 0 ? "auto" : 120,
                  borderRadius: "4px 4px 0px 0px",
                  transition: "right 0.2s linear",
                  MozTransition: "right 0.2s linear",
                }}
                {...editingProps}
              />
            </Box>
          ) : (
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
          )}
        </AspectRatio>
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
            classNames={{
              root: classes.switchRoot,
              input: classes.switchInput,
              body: classes.switchBody,
              track: classes.switchTrack,
              trackLabel: classes.switchTrackLabel,
              thumb: classes.switchThumb,
            }}
          />
        )}
      </Paper>
    </Box>
  );
}

export default CollectionCard;
