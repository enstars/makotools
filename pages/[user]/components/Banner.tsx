import {
  ActionIcon,
  Box,
  Card,
  createStyles,
  Group,
  Input,
  Select,
  Text,
} from "@mantine/core";
import { useListState } from "@mantine/hooks";
import { IconTrash } from "@tabler/icons";
import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import useUser from "services/firebase/user";
import { GameCard } from "types/game";
import Picture from "components/core/Picture";

const useStyles = createStyles((theme) => ({
  item: {
    ...theme.fn.focusStyles(),
    display: "flex",
    alignItems: "center",
    borderRadius: theme.radius.md,
    border: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
    padding: `${theme.spacing.sm}px ${theme.spacing.xl}px`,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.white,
    marginBottom: theme.spacing.sm,
  },

  itemDragging: {
    boxShadow: theme.shadows.sm,
  },

  symbol: {
    fontSize: 30,
    fontWeight: 700,
    width: 60,
  },
}));

function Banner({ cards }: { cards: GameCard[] | undefined }) {
  const user = useUser();
  const [acValue, setAcValue] = useState("");

  const { classes, cx } = useStyles();
  const [state, handlers] = useListState(
    (user.loggedIn && user.db?.profile__banner) || []
  );

  useEffect(() => {
    if (
      user.loggedIn &&
      user.db?.profile__banner &&
      JSON.stringify(user.db.profile__banner) !== JSON.stringify(state)
    ) {
      user.db.set({ profile__banner: state });
    }
  }, [state]);

  if (!cards)
    return (
      <Text color="dimmed" size="sm">
        Error fetching card data.
      </Text>
    );

  const items = state.map((item, index) => (
    <Draggable key={item} index={index} draggableId={item.toString()}>
      {(provided, snapshot) => (
        <Card
          radius="sm"
          p={0}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          sx={{ overflow: "hidden", maxHeight: 64 }}
          mt="xs"
          shadow="sm"
        >
          <Group noWrap>
            <Picture
              alt={cards.find((c) => c.id === item)?.title[0] || "card"}
              srcB2={`assets/card_still_full1_${item}_evolution.png`}
              sx={{
                width: 60,
                height: 60,
                margin: 2,
              }}
              radius={4}
            />
            <Box
              sx={{
                flexGrow: 1,
                minWidth: 0,
                flexBasis: 0,
                maxWidth: "100%",
                "& div": {
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                },
              }}
            >
              <Text weight={700}>
                {cards.find((c) => c.id === item)?.title[0]}
              </Text>
              <Text size="sm" color="dimmed">
                {cards.find((c) => c.id === item)?.name?.[0]}
              </Text>
            </Box>
            <ActionIcon
              color="red"
              onClick={() => handlers.remove(index)}
              mr="md"
            >
              <IconTrash size={16} />
            </ActionIcon>
          </Group>
        </Card>
      )}
    </Draggable>
  ));

  return (
    <Input.Wrapper label="Banner Cards">
      <DragDropContext
        onDragEnd={({ destination, source }) => {
          handlers.reorder({
            from: source.index,
            to: destination?.index || 0,
          });
        }}
      >
        <Droppable droppableId="dnd-list" direction="vertical">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {items}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <Select
        placeholder="Type to search for a card"
        value={acValue}
        onChange={(value) => {
          if (value) handlers.append(parseInt(value));
          if (user.loggedIn)
            user.db.set({ profile__banner: [...state, value] });
        }}
        searchable
        limit={25}
        data={[
          {
            value: "-",
            label: "Start typing to search for a card...",
            disabled: true,
          },
          ...cards
            ?.filter((c) => c?.title)
            ?.filter((c) => !state.includes(c.id))
            ?.map((c) => ({
              label: `(${c.title[0]}) ${c?.name?.[0]}`,
              value: c.id.toString(),
            })),
        ]}
        mt="xs"
        disabled={state?.length > 10}
      />
    </Input.Wrapper>
  );
}

export default Banner;
