import {
  ActionIcon,
  Box,
  Button,
  Divider,
  Group,
  Menu,
  Modal,
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
  IconCheck,
  IconChevronLeft,
  IconChevronUp,
  IconDots,
  IconEye,
  IconSortAscending,
  IconSortDescending,
  IconTrash,
  IconX,
} from "@tabler/icons";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { GridContextProvider, GridDropZone, GridItem } from "react-grid-drag";

import CollectionCard from "./CollectionCard";

import { useDayjs } from "services/libraries/dayjs";
import {
  CardCollection,
  CollectedCard,
  CollectionPrivacyLevel,
} from "types/makotools";
import { GameCard, GameUnit } from "types/game";

function EditCollectionCards({
  collection,
  units,
  allCards,
  handlers,
  index,
  setFunction,
  icons,
  defaultCollection,
  defaultFunction,
}: {
  collection: CardCollection;
  units: GameUnit[];
  allCards: GameCard[];
  handlers: UseListStateHandlers<CardCollection>;
  index: number;
  setFunction: Dispatch<SetStateAction<CardCollection | undefined>>;
  icons: JSX.Element[];
  defaultCollection: CardCollection | null;
  defaultFunction: Dispatch<SetStateAction<CardCollection | null>>;
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
    cardHandlers.setState(collection.cards || []);
  }, [collection]);

  useEffect(() => {
    handlers.setItemProp(index, "cards", cards);
  }, [cards, index]);

  const NUM_COLS =
    window.innerWidth < 768
      ? 2
      : window.innerWidth > 786 && window.innerWidth < 900
      ? 4
      : 5;

  const ROW_HEIGHT = 200;

  const height = Math.ceil(cards.length / NUM_COLS) * ROW_HEIGHT;

  return (
    <>
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
            setFunction(undefined);
          }}
        >
          <IconChevronLeft size={40} strokeWidth={3} />
        </ActionIcon>
        <Title order={3}>Edit {collection.name} cards</Title>
      </Group>
      <Group noWrap p="md">
        <Menu position="top">
          <Menu.Target>
            <ActionIcon>
              <Box sx={{ display: "flex", flexFlow: "row no-wrap" }}>
                {icons[collection.icon || 0]} <IconChevronUp size={20} />
              </Box>
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown sx={{ width: "auto", maxWidth: "260px" }}>
            <Menu.Label sx={{ textAlign: "center" }}>
              Choose a collection icon
            </Menu.Label>
            {icons.map((icon, i) => (
              <Menu.Item
                key={icon.key}
                component="button"
                onClick={() => {
                  console.log(index, i);
                  handlers.setItemProp(index, "icon", i);
                }}
                sx={{ width: "auto", display: "inline" }}
              >
                {icon}
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>
        <TextInput
          id="field-0"
          aria-label="Input collection name"
          placeholder="Input collection name"
          onFocus={(event) => setFocused(event.target.id)}
          onBlur={(event) => setFocused("")}
          defaultValue={collection.name}
          onChange={(event) =>
            handlers.setItemProp(index, "name", event.currentTarget.value)
          }
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
              icon={<IconCheck />}
              disabled={
                defaultCollection?.id === collection.id ||
                collection.privacyLevel > 0
              }
              onClick={() => {
                defaultFunction(collection);
              }}
            >
              Set collection as default
            </Menu.Item>
            <Menu.Item
              icon={<IconEye />}
              component="div"
              sx={{ alignItems: "flex-start" }}
              closeMenuOnClick={false}
            >
              <Stack>
                <Text>Set Privacy Level</Text>
                <Select
                  data={[
                    { value: "0", label: "Public to everyone" },
                    { value: "1", label: "Visible to logged in users" },
                    { value: "2", label: "Visible only to friends" },
                    { value: "3", label: "Completely private" },
                  ]}
                  defaultValue={`${collection.privacyLevel}`}
                  onChange={(value) => {
                    handlers.setItemProp(
                      index,
                      "privacyLevel",
                      parseInt(value as string) as CollectionPrivacyLevel
                    );
                    if (
                      parseInt(value as string) > 0 &&
                      defaultCollection?.id === collection.id
                    ) {
                      handlers.setItemProp(index, "default", false);
                      defaultFunction(null);
                    }
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
        <Box sx={{ width: "100%", height: "100%" }}>
          <GridContextProvider
            onChange={(
              sourceId: string,
              sourceIndex: number,
              targetIndex: number,
              targetId: string
            ) => {
              cardHandlers.reorder({ from: sourceIndex, to: targetIndex });
              console.log([...cards].map((c) => c.id));
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
              {cards
                .filter((c: CollectedCard) => c.count)
                .map((c: CollectedCard, index: number) => (
                  <GridItem key={c.id}>
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
      ) : (
        <Text color="dimmed">This collection is empty.</Text>
      )}
    </>
  );
}

export default EditCollectionCards;
