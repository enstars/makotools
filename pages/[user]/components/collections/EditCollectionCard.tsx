import {
  Box,
  ActionIcon,
  AspectRatio,
  Image,
  NumberInput,
  createStyles,
} from "@mantine/core";
import { UseListStateHandlers } from "@mantine/hooks";
import { IconFlower, IconFlowerOff, IconTrash } from "@tabler/icons";
import { useState } from "react";

import { getAssetURL } from "services/data";
import { CollectedCard } from "types/makotools";

const useStyles = createStyles((theme, params, getRef) => ({
  cardSwitched: {
    [`& .${getRef("card")}`]: {
      transform: "rotateY(180deg)",
    },
  },
  card: {
    ref: getRef("card"),
  },
}));

function EditCollectionCard({
  card,
  handlers,
  index,
}: {
  card: CollectedCard;
  handlers: UseListStateHandlers<CollectedCard>;
  index: number;
}) {
  const { classes, cx } = useStyles();
  const [checked, setChecked] = useState<boolean>(card.id > 0);

  return (
    <Box
      sx={(theme) => ({
        position: "relative",
        width: "100%",
        height: "100%",
        padding: theme.spacing.xs / 2,
        "&:hover": { cursor: "grab" },
      })}
    >
      <ActionIcon
        variant="filled"
        color="dark"
        radius="sm"
        onClick={() => handlers.remove(index)}
        size="sm"
        sx={(theme) => ({
          position: "absolute",
          top: theme.spacing.xs,
          right: theme.spacing.xs,
          zIndex: 3,
        })}
      >
        <IconTrash size={12} />
      </ActionIcon>
      <ActionIcon
        variant="filled"
        color={card.id > 0 ? "mao_pink" : "gray"}
        radius="sm"
        onClick={() => {
          const flip = card.id < 0 ? 1 : -1;
          handlers.setItemProp(index, "id", Math.abs(card.id) * flip);
        }}
        size="sm"
        sx={(theme) => ({
          position: "absolute",
          bottom: theme.spacing.xs,
          right: theme.spacing.xs,
          zIndex: 3,
        })}
      >
        <Box
          sx={(theme) => ({
            position: "absolute",
            transform:
              card.id > 0 ? "scale(1) rotate(180deg)" : "scale(0) rotate(0deg)",
            transition: theme.other.transition,
          })}
        >
          <IconFlower size={12} />
        </Box>
        <Box
          sx={(theme) => ({
            opacity: card.id > 0 ? 0 : 1,
            transition: theme.other.transition,
          })}
        >
          <IconFlowerOff size={12} />
        </Box>
      </ActionIcon>
      <Box
        sx={{
          width: "50%",
          position: "absolute",
          bottom: 8,
          left: 8,
          zIndex: 3,
        }}
      >
        <NumberInput
          aria-label="Number of card copies"
          min={1}
          max={5}
          value={card.count}
          onChange={(amt) =>
            handlers.setItemProp(index, "count", amt as number)
          }
        />
      </Box>
      <Box sx={{ position: "relative" }}>
        <AspectRatio
          ratio={4 / 5}
          sx={{ "& > *": { overflow: "visible !important" } }}
          // className={cx(classes.cardSwitched)}
        >
          <Box
            sx={{
              position: "absolute",
              perspective: 500,
              width: "100%",
              height: "100%",
            }}
            className={card.id < 0 ? cx(classes.cardSwitched) : undefined}
          >
            <Box
              className={cx(classes.card)}
              sx={{
                position: "absolute",
                img: {
                  pointerEvents: "none",
                },
                width: "100%",
                height: "100%",
                transition: "transform 0.5s",
                transformStyle: "preserve-3d",
              }}
            >
              <Image
                id="bloomed"
                alt={"card image"}
                withPlaceholder
                src={getAssetURL(
                  `assets/card_rectangle4_${Math.abs(card.id)}_evolution.png`
                )}
                sx={{
                  position: "absolute",
                  // top: 0,
                  backfaceVisibility: "hidden",
                  background: "transparent",
                }}
                radius="sm"
              />
              <Image
                alt={"card image"}
                withPlaceholder
                src={getAssetURL(
                  `assets/card_rectangle4_${Math.abs(card.id)}_normal.png`
                )}
                sx={{
                  position: "absolute",
                  // top: 0,
                  transform: "rotateY(180deg)",
                  backfaceVisibility: "hidden",
                  background: "transparent",
                }}
                radius="sm"
              />
            </Box>
          </Box>
        </AspectRatio>
      </Box>
    </Box>
  );
}

export default EditCollectionCard;
