import { Box, Button, Group, Stack } from "@mantine/core";
import React from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { IconMenuOrder, IconPlus } from "@tabler/icons";
import { useElementSize, UseListStateHandlers } from "@mantine/hooks";

import EditCollectionCards from "./EditCollectionCards";
import EditCollectionFolder from "./EditCollectionFolder";

import useUser from "services/firebase/user";
import { CONSTANTS } from "services/makotools/constants";
import { CardCollection, UserData } from "types/makotools";
import { GameCard, GameUnit } from "types/game";
export default function EditAllCollections({
  editMode,
  currentCollection,
  isReordering,
  setCurrentCollection,
  units,
  cards,
  editingHandlers,
  addNewCollection,
  setIsReordering,
  tempCollectionsWhileReordering,
  tempHandlersWhileReordering,
  editingCollections,
  profile,
}: {
  editMode: boolean;
  currentCollection: number | undefined;
  isReordering: boolean;
  setCurrentCollection: React.Dispatch<
    React.SetStateAction<number | undefined>
  >;
  units: GameUnit[];
  cards: GameCard[];
  editingHandlers: UseListStateHandlers<CardCollection>;
  addNewCollection: () => void;
  setIsReordering: React.Dispatch<React.SetStateAction<boolean>>;
  tempCollectionsWhileReordering: CardCollection[];
  tempHandlersWhileReordering: UseListStateHandlers<CardCollection>;
  editingCollections: CardCollection[];
  profile: UserData;
}) {
  const user = useUser();
  const { ref, width } = useElementSize();
  if (!user.loggedIn) return null;

  if (isReordering)
    return (
      <DragDropContext
        onDragEnd={async ({ destination, source }) => {
          tempHandlersWhileReordering.reorder({
            from: source.index,
            to: destination?.index || 0,
          });
        }}
      >
        <Droppable droppableId="dnd-list" direction="vertical">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {tempCollectionsWhileReordering.map((collection, index) => (
                <Draggable
                  key={collection.id}
                  index={index}
                  draggableId={collection.id}
                >
                  {(provided, snapshot) => (
                    <Box
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                      sx={(theme) => ({
                        marginBottom: theme.spacing.xs,
                      })}
                    >
                      <EditCollectionFolder
                        collection={collection}
                        setFunction={(collection) => {
                          setCurrentCollection(
                            editingCollections.indexOf(collection)
                          );
                        }}
                        reordering
                      />
                    </Box>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  return (
    <Box
      ref={ref}
      sx={{
        position: "relative",
        maxWidth: "100%",
        overflow: "hidden",
      }}
    >
      <Group
        align="flex-start"
        sx={(theme) => ({
          width: `calc(200% + ${theme.spacing.xs}px)`,
          gap: theme.spacing.xs,
          "& > *": {
            flex: "1 1 100px",
            boxSizing: "border-box",
          },
          transform:
            typeof currentCollection === "number"
              ? `translateX(calc(-50% - ${theme.spacing.xs / 2}px))`
              : "translateX(0%)",
          transition: "0.5s ease",
        })}
      >
        <Stack spacing="xs">
          {editingCollections
            .sort((a, b) => a.order - b.order)
            .map((collection, index) => (
              <EditCollectionFolder
                key={collection.id}
                collection={collection}
                setFunction={(collection) => {
                  setCurrentCollection(editingCollections.indexOf(collection));
                }}
              />
            ))}

          <Group position="left">
            <Button
              color="indigo"
              variant="light"
              leftIcon={<IconPlus size={16} />}
              onClick={addNewCollection}
              disabled={
                editingCollections.length >=
                CONSTANTS.PATREON.TIERS[profile.admin?.patreon || 0].COLLECTIONS
              }
            >
              New
            </Button>
            <Button
              color="indigo"
              variant="light"
              leftIcon={<IconMenuOrder size={16} />}
              onClick={() => {
                setIsReordering(true);
                tempHandlersWhileReordering.setState(
                  editingCollections.sort((a, b) => a.order - b.order)
                );
              }}
            >
              Reorder
            </Button>
          </Group>
        </Stack>
        <Box>
          {typeof currentCollection === "number" && (
            <EditCollectionCards
              collection={editingCollections[currentCollection]}
              units={units}
              allCards={cards}
              handlers={editingHandlers}
              index={currentCollection}
              setFunction={() => {
                setCurrentCollection(undefined);
              }}
              width={width}
            />
          )}
        </Box>
      </Group>
    </Box>
  );
}
