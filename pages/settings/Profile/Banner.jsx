import {
  ActionIcon,
  Autocomplete,
  Box,
  Button,
  Card,
  createStyles,
  Group,
  Image,
  Input,
  Paper,
  Select,
  Text,
} from "@mantine/core";
import { useListState } from "@mantine/hooks";
import { IconTrash } from "@tabler/icons";
import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { getB2File } from "../../../services/ensquare";

import { useFirebaseUser } from "../../../services/firebase/user";

import TextSetting from "../shared/TextSetting";

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

function Banner({ cards }) {
  const { firebaseUser, setUserDataKey } = useFirebaseUser();
  const [acValue, setAcValue] = useState("");

  const { classes, cx } = useStyles();
  const [state, handlers] = useListState(
    firebaseUser?.firestore?.profile__banner || []
  );

  const items = state.map((item, index) => (
    <Draggable key={item} index={index} draggableId={item.toString()}>
      {(provided, snapshot) => (
        <Card
          radius="sm"
          //   withBorder
          p={0}
          //   className={cx(classes.item, {
          //     [classes.itemDragging]: snapshot.isDragging,
          //   })}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          sx={{ overflow: "hidden" }}
          mt="xs"
        >
          <Group>
            <Image
              alt={cards.find((c) => c.id === item).title}
              src={getB2File(`assets/card_still_full1_${item}_evolution.png`)}
              width={64}
              height={64}
            />
            <Box sx={{ flexGrow: 1 }}>
              <Text weight={700}>{cards.find((c) => c.id === item).title}</Text>
              <Text size="sm" color="dimmed">
                {cards.find((c) => c.id === item).name}
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
  console.log(state, cards);

  useEffect(() => {
    if (
      firebaseUser.loggedIn &&
      firebaseUser?.firestore &&
      firebaseUser.firestore?.profile__banner &&
      JSON.stringify(firebaseUser.firestore.profile__banner) !==
        JSON.stringify(state)
    ) {
      setUserDataKey({ profile__banner: state });
    }
  }, [state]);

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
        placeholder="Add a card"
        value={acValue}
        onChange={(value) => {
          console.log(value);
          handlers.append(value);
          //   setUserDataKey({ profile__banner: [...state, value] });
        }}
        searchable
        limit={25}
        data={
          cards
            ?.filter((c) => c?.title)
            ?.filter((c) => !state.includes(c.id))
            ?.map((c) => ({ label: `(${c.title}) ${c.name}`, value: c.id })) ||
          []
        }
        mt="xs"
        disabled={state?.length > 10}
      />
    </Input.Wrapper>
  );
}

export default Banner;
