import {
  ActionIcon,
  Box,
  Button,
  Group,
  Modal,
  Paper,
  Select,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import {
  useDisclosure,
  useListState,
  UseListStateHandlers,
} from "@mantine/hooks";
import {
  IconArrowsSort,
  IconCheck,
  IconChevronDown,
  IconChevronLeft,
  IconEye,
  IconSortAscending,
  IconTrash,
} from "@tabler/icons";
import { useEffect, useState } from "react";
import { GridContextProvider, GridDropZone, GridItem } from "react-grid-drag";

import EditCollectionCard from "./EditCollectionCard";

import PRIVACY_LEVELS from "components/collections/privacyLevels";
import { COLLECTION_ICONS } from "components/collections/collectionIcons";
import { useDayjs } from "services/libraries/dayjs";
import { CardCollection, CollectedCard } from "types/makotools";
import { GameCard, GameUnit } from "types/game";
import CollectionIconsMenu from "components/collections/CollectionIconsMenu";

function EditCollection({
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
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [sort, setSort] = useState<string>("");
  const [privacyModalOpened, privacyModalHandlers] = useDisclosure(false);
  const { dayjs } = useDayjs();
  const [cards, cardHandlers] = useListState<CollectedCard>(
    collection.cards || []
  );
  useEffect(() => {
    handlers.setItemProp(index, "cards", cards);
  }, [cards, index]);

  const NUM_COLS = Math.floor((width - 24) / 120);

  const ROW_HEIGHT = (((width - 24) / NUM_COLS - 10) * 5) / 4 + 10;
  const height = Math.ceil(cards.length / NUM_COLS) * ROW_HEIGHT;

  const icon = COLLECTION_ICONS[collection.icon || 0];
  const sortBy = (value: string) => {
    setSort(value);
    let sorted: CollectedCard[] = [];
    switch (value) {
      case "dateAdded":
        sorted = [...cards].sort((a: CollectedCard, b: CollectedCard) =>
          dayjs(b.dateAdded).diff(dayjs(a.dateAdded))
        );
        break;
      case "charId":
        sorted = [...cards].sort((a, b) => {
          const charIdA =
            allCards.find((c) => c.id === Math.abs(a.id))?.character_id || 0;
          const charIdB =
            allCards.find((c) => c.id === Math.abs(b.id))?.character_id || 0;

          // TODO: replace with actual character order
          return charIdA - charIdB;
        });
        break;
      case "cardId":
        sorted = [...cards].sort((a, b) => Math.abs(a.id) - Math.abs(b.id));
        break;
      case "amount":
        sorted = [...cards].sort((a, b) => b.count - a.count);
        break;
      case "rarity":
        sorted = [...cards].sort((a, b) => {
          let rarityA = allCards.find((c) => c.id === a.id)?.rarity || 0;
          let rarityB = allCards.find((c) => c.id === b.id)?.rarity || 0;
          return rarityB - rarityA;
        });
        break;
      default:
        break;
    }
    if (sorted.length > 0) {
      cardHandlers.setState(sorted);
    }
  };
  return (
    <Paper p="sm" withBorder>
      <Modal
        opened={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        title={
          <Text weight={700} size="lg">
            Delete {collection.name}?
          </Text>
        }
        withCloseButton={false}
        centered
        size="sm"
      >
        <Text mb="xs">Are you sure you want to delete {collection.name}?</Text>
        <Group position="right" spacing="xs">
          <Button
            leftIcon={<IconTrash size={16} />}
            color="red"
            variant="outline"
            onClick={() => {
              setOpenDeleteModal(false);
              handlers.remove(index);
              setFunction();
            }}
          >
            Yes, Delete
          </Button>
          <Button onClick={() => setOpenDeleteModal(false)}>No, go back</Button>
        </Group>
      </Modal>
      <Modal
        opened={privacyModalOpened}
        onClose={privacyModalHandlers.close}
        withCloseButton={false}
        centered
        size="xs"
      >
        <Text mb="xs" weight={500} size="sm">
          Make the collection visible to...
        </Text>
        <Group
          sx={{
            "& > *": {
              flex: "1 1 0",
              minWidth: 0,
            },
            "&&&&&": {
              flexWrap: "wrap",
            },
          }}
          spacing="xs"
        >
          {PRIVACY_LEVELS.map((privacyLevel) => (
            <Button
              key={privacyLevel.value}
              variant={
                privacyLevel.value === collection.privacyLevel
                  ? "filled"
                  : "light"
              }
              sx={{ height: 100, alignItems: "start", minWidth: 90 }}
              p="xs"
              pt="md"
              styles={{ label: { alignItems: "start" } }}
              color={privacyLevel.color}
              onClick={() => {
                handlers.setItemProp(index, "privacyLevel", privacyLevel.value);
              }}
            >
              <Stack align="center" sx={{ minWidth: 0, maxWidth: "100%" }}>
                <privacyLevel.icon size={32} />
                <Text
                  weight={700}
                  size="xs"
                  sx={{ minWidth: 0, maxWidth: "100%", whiteSpace: "normal" }}
                  align="center"
                >
                  {privacyLevel.title}
                </Text>
              </Stack>
            </Button>
          ))}
        </Group>
        <Group position="right" mt="xs">
          <Button
            leftIcon={<IconCheck size={16} />}
            onClick={() => {
              privacyModalHandlers.close();
            }}
          >
            Done
          </Button>
        </Group>
      </Modal>
      <Group spacing="xs">
        <ActionIcon
          onClick={() => {
            setFunction();
          }}
        >
          <IconChevronLeft size={18} />
        </ActionIcon>
        <Text weight={700} size="lg">
          Edit collection
        </Text>
      </Group>
      <Group my="xs" spacing="xs">
        <TextInput
          aria-label="Input collection name"
          placeholder="Collection name"
          value={collection.name}
          onChange={(event) =>
            handlers.setItemProp(index, "name", event.currentTarget.value)
          }
          styles={(theme) => ({
            icon: {
              pointerEvents: "auto",
              justifyContent: "start",
            },
          })}
          iconWidth={62}
          icon={
            <CollectionIconsMenu
              target={
                <Button
                  variant="default"
                  sx={{
                    width: 50,
                    padding: 0,
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                    display: "flex",
                    flexWrap: "nowrap",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text color={icon.color} inline ml={4} mr={4}>
                    {/* @ts-ignore im too lazy to fix this */}
                    <icon.component size={18} {...icon.props} />
                  </Text>
                  <Text color="dimmed" inline mt={2}>
                    <IconChevronDown size={16} />
                  </Text>
                </Button>
              }
              onChange={(value) => {
                handlers.setItemProp(index, "icon", value);
              }}
            />
          }
          rightSection={
            <ActionIcon
              variant="default"
              sx={{
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
              }}
              size={36}
              onClick={() => privacyModalHandlers.open()}
            >
              <IconEye size={16} />
            </ActionIcon>
          }
          sx={{ "&&&&&": { minWidth: 225, flexGrow: 2 } }}
        />
        {cards.length > 1 && (
          <Select
            value={sort}
            placeholder="Sort by..."
            withinPortal
            data={[
              { value: "dateAdded", label: "Date added" },
              { value: "charId", label: "Character ID" },
              { value: "cardId", label: "Card ID" },
              { value: "amount", label: "Card amount" },
              { value: "rarity", label: "Card rarity" },
            ]}
            icon={<IconSortAscending size="1em" />}
            rightSection={
              <Tooltip label="Flip order">
                <ActionIcon
                  variant="light"
                  color="blue"
                  onClick={() => {
                    const reversed = [...cards].reverse();
                    cardHandlers.setState(reversed);
                  }}
                >
                  <IconArrowsSort size={16} />
                </ActionIcon>
              </Tooltip>
            }
            onChange={sortBy}
            sx={{ "&&&&&": { minWidth: 150, flexGrow: 1, flexBasis: 150 } }}
          />
        )}
        <ActionIcon
          variant="default"
          size={36}
          onClick={() => setOpenDeleteModal(true)}
          sx={(theme) => ({
            color: theme.colors.red[5],
          })}
        >
          <IconTrash size={16} />
        </ActionIcon>
      </Group>

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
                setSort("");
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
                    <EditCollectionCard
                      card={c}
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

export default EditCollection;
