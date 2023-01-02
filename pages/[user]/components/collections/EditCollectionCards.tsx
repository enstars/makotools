import {
  ActionIcon,
  Box,
  Button,
  Divider,
  Group,
  Menu,
  Modal,
  Paper,
  Select,
  Space,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { useListState, UseListStateHandlers } from "@mantine/hooks";
import {
  IconArrowsSort,
  IconChevronLeft,
  IconDots,
  IconEye,
  IconSortAscending,
  IconSortDescending,
  IconTrash,
  IconX,
} from "@tabler/icons";
import { useEffect, useState } from "react";
import { GridContextProvider, GridDropZone, GridItem } from "react-grid-drag";

import CollectionCard from "./CollectionCard";

import { useDayjs } from "services/libraries/dayjs";
import {
  CardCollection,
  CollectedCard,
  CollectionPrivacyLevel,
} from "types/makotools";
import { GameCard, GameUnit } from "types/game";
import {
  COLLECTION_PRIVACY_LEVEL_DESCRIPTION,
  MAX_COLLECTION_NAME_LENGTH,
} from "services/makotools/collection";
import CollectionIconMenu from "components/collections/CollectionIconMenu";

function EditCollectionCards({
  collection,
  units,
  allCards,
  handlers,
  index,
  setFunction,
  width,
}: {
  collection: CardCollection;
  units: GameUnit[];
  allCards: GameCard[];
  handlers: UseListStateHandlers<CardCollection>;
  index: number;
  setFunction: () => void;
  width: number;
}) {
  const theme = useMantineTheme();

  const [focused, setFocused] = useState<string>("");
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const { dayjs } = useDayjs();
  const [asc, setAsc] = useState<boolean>(true);
  const [cards, cardHandlers] = useListState<CollectedCard>(
    collection.cards || []
  );
  useEffect(() => {
    handlers.setItemProp(index, "cards", cards);
  }, [cards, index]);

  const NUM_COLS = Math.floor((width - 40) / 120);

  const ROW_HEIGHT = (((width - 40) / NUM_COLS - 10) * 5) / 4 + 10;
  console.log(NUM_COLS, ROW_HEIGHT);
  const height = Math.ceil(cards.length / NUM_COLS) * ROW_HEIGHT;

  console.log(cards.map((c) => c?.id));
  return (
    <Paper p="lg" withBorder>
      <Modal
        opened={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        title={<Title order={3}>Delete {collection.name}?</Title>}
        withCloseButton={false}
        centered
        size="lg"
      >
        <Text size="lg">
          Are you sure you want to delete {collection.name}?
        </Text>
        <Space h="lg" />
        <Group position="right">
          <Button variant="outline" onClick={() => setOpenDeleteModal(false)}>
            No, go back
          </Button>
          <Button
            leftIcon={<IconTrash />}
            color="red"
            onClick={() => {
              setOpenDeleteModal(false);
              handlers.remove(index);
            }}
          >
            Yes, Delete
          </Button>
        </Group>
      </Modal>
      <Group>
        <ActionIcon
          onClick={() => {
            setFunction();
          }}
        >
          <IconChevronLeft size={40} strokeWidth={3} />
        </ActionIcon>
        <Title order={3}>Edit {collection.name} cards</Title>
      </Group>
      <Group noWrap p="md">
        <CollectionIconMenu
          value={collection.icon}
          onChange={(i) => {
            handlers.setItemProp(index, "icon", i);
          }}
        />
        <TextInput
          id="field-0"
          aria-label="Input collection name"
          placeholder="Input collection name"
          onFocus={(event) => setFocused(event.target.id)}
          onBlur={(event) => setFocused("")}
          defaultValue={collection.name}
          onChange={(event) => {
            const newName = event.currentTarget.value.substring(
              0,
              MAX_COLLECTION_NAME_LENGTH
            );
            handlers.setItemProp(index, "name", newName);
          }}
          styles={{
            input: {
              fontFamily: theme.headings.fontFamily,
              fontWeight: "bold",
            },
          }}
        />
        <Menu position="top">
          <Menu.Target>
            <ActionIcon>
              <IconDots />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>Collection options</Menu.Label>
            <Menu.Item
              icon={<IconEye />}
              component="div"
              sx={{ alignItems: "flex-start" }}
              closeMenuOnClick={false}
            >
              <Stack>
                <Text>Set Privacy Level</Text>
                <Select
                  data={[0, 1, 2, 3].map((level) => ({
                    value: JSON.stringify(level),
                    label: COLLECTION_PRIVACY_LEVEL_DESCRIPTION[
                      level
                    ] as string,
                  }))}
                  defaultValue={`${collection.privacyLevel}`}
                  onChange={(value) => {
                    handlers.setItemProp(
                      index,
                      "privacyLevel",
                      parseInt(value as string) as CollectionPrivacyLevel
                    );
                  }}
                />
              </Stack>
            </Menu.Item>
            <Divider />
            <Menu.Item
              icon={<IconX />}
              sx={{ color: theme.colors.red[4] }}
              onClick={() => setOpenDeleteModal(true)}
            >
              Delete collection
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
      <Space h="md" />
      {cards.length > 1 && (
        <Select
          placeholder="Sort by..."
          data={[
            { value: "dateAdded", label: "Date added" },
            { value: "charId", label: "Character ID" },
            { value: "cardId", label: "Card ID" },
            { value: "amount", label: "Card amount" },
            { value: "rarity", label: "Card rarity" },
          ]}
          icon={<IconArrowsSort size="1em" />}
          rightSection={
            <Tooltip label="Toggle ascending/descending">
              <ActionIcon
                variant="light"
                color="blue"
                onClick={() => {
                  const reversed = cards.reverse();
                  handlers.setItemProp(index, "cards", reversed);
                }}
              >
                {asc ? (
                  <IconSortAscending size={16} />
                ) : (
                  <IconSortDescending size={16} />
                )}
              </ActionIcon>
            </Tooltip>
          }
          onChange={(value) => {
            let sorted;
            switch (value) {
              case "dateAdded":
                sorted = cards.sort((a: CollectedCard, b: CollectedCard) =>
                  dayjs(a.dateAdded).diff(dayjs(b.dateAdded))
                );

                break;
              case "charId":
                sorted = cards.sort((a: CollectedCard, b: CollectedCard) => {
                  let charA =
                    allCards.find((c) => c.id === a.id)?.character_id || 0;
                  let charB =
                    allCards.find((c) => c.id === b.id)?.character_id || 0;
                  return charA - charB;
                });
                break;
              case "cardId":
                sorted = cards.sort(
                  (a: CollectedCard, b: CollectedCard) => a.id - b.id
                );
                break;
              case "amount":
                sorted = cards.sort(
                  (a: CollectedCard, b: CollectedCard) => b.count - a.count
                );
              case "rarity":
                sorted = cards.sort((a: CollectedCard, b: CollectedCard) => {
                  let rarityA =
                    allCards.find((c) => c.id === a.id)?.rarity || 0;
                  let rarityB =
                    allCards.find((c) => c.id === b.id)?.rarity || 0;
                  return rarityB - rarityA;
                });
              default:
                break;
            }
            sorted && handlers.setItemProp(index, "cards", sorted);
          }}
        />
      )}
      <Space h="lg" />
      {cards && cards.length > 0 ? (
        <Box
          sx={(theme) => ({
            margin: -theme.spacing.xs / 2,
          })}
        >
          <Box sx={{ width: "100%", height: "100%" }}>
            <GridContextProvider
              onChange={(
                sourceId?: string,
                sourceIndex?: number,
                targetIndex?: number,
                targetId?: string
              ) => {
                if (
                  sourceIndex === targetIndex ||
                  typeof sourceIndex === "undefined" ||
                  typeof targetIndex === "undefined"
                )
                  return;
                cardHandlers.reorder({ from: sourceIndex, to: targetIndex });
              }}
            >
              <GridDropZone
                id="card-drop-zone"
                boxesPerRow={NUM_COLS}
                rowHeight={ROW_HEIGHT}
                style={{
                  width: "100%",
                  height: height,
                }}
              >
                {cards.map((c: CollectedCard, index: number) => (
                  <GridItem key={Math.abs(c.id)}>
                    <CollectionCard
                      card={c}
                      editing={true}
                      collHandlers={handlers}
                      handlers={cardHandlers}
                      index={index}
                    />
                  </GridItem>
                ))}
              </GridDropZone>
            </GridContextProvider>
          </Box>
        </Box>
      ) : (
        <Text color="dimmed">This collection is empty.</Text>
      )}
    </Paper>
  );
}

export default EditCollectionCards;
