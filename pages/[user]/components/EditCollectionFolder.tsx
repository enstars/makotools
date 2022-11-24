import {
  Paper,
  Group,
  Menu,
  Indicator,
  ActionIcon,
  TextInput,
  Stack,
  Select,
  Divider,
  Text,
  useMantineTheme,
  Button,
  Modal,
  Space,
  Title,
} from "@mantine/core";
import {
  IconPencil,
  IconCircle,
  IconDots,
  IconCheck,
  IconEye,
  IconX,
  IconTrash,
  IconChevronRight,
} from "@tabler/icons";
import { Dispatch, SetStateAction, useState } from "react";

import { CardCollection } from "types/makotools";

function EditCollectionFolder({
  collection,
  defaultCollection,
  deleteFunction,
  cardsFunction,
  setFunction,
  defaultFunction,
}: {
  collection: CardCollection;
  defaultCollection: CardCollection;
  deleteFunction: (collection: CardCollection) => void;
  cardsFunction: Dispatch<SetStateAction<boolean>>;
  setFunction: Dispatch<SetStateAction<CardCollection>>;
  defaultFunction: Dispatch<SetStateAction<CardCollection>>;
}) {
  const COLORS: string[] = [
    "#d3d6e0",
    "#ff8787",
    "#faa2c1",
    "#b197fc",
    "#4dabf7",
    "#38d9a9",
    "#a9e34b",
    "#ffd43b",
  ];
  const theme = useMantineTheme();

  const [focused, setFocused] = useState<string>("");
  const [collName, changeName] = useState<string>(collection.name || "");
  const [color, setColor] = useState<string>(collection.color || "#D3D6E0");
  const [privacyLevel, setPrivacy] = useState<number>(
    collection.privacyLevel || 0
  );
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);

  return (
    <>
      <Modal
        opened={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        title={<Title order={3}>Delete {collName}?</Title>}
        withCloseButton={false}
        centered
        size="lg"
      >
        <Text size="lg">Are you sure you want to delete {collName}?</Text>
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
              deleteFunction(collection);
            }}
          >
            Yes, Delete
          </Button>
        </Group>
      </Modal>
      <Paper withBorder>
        <Group position="apart">
          <Group noWrap p="md">
            <Menu position="top">
              <Menu.Target>
                <Indicator
                  color="indigo"
                  size={15}
                  offset={5}
                  label={<IconPencil size={10} />}
                >
                  <ActionIcon>
                    <IconCircle fill={color} size={20} />
                  </ActionIcon>
                </Indicator>
              </Menu.Target>
              <Menu.Dropdown sx={{ width: "auto", maxWidth: "190px" }}>
                <Menu.Label>Choose Collection Color</Menu.Label>
                {COLORS.map((color) => (
                  <Menu.Item
                    key={color}
                    component="button"
                    onClick={() => setColor(color)}
                    sx={{ width: "auto", display: "inline" }}
                  >
                    <IconCircle size={20} fill={color} stroke={0} />
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
              onChange={(event) => changeName(event.currentTarget.value)}
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
                  disabled={defaultCollection.id === collection.id}
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
                      defaultValue={`${privacyLevel}`}
                      onChange={(value) =>
                        setPrivacy(parseInt(value as string))
                      }
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
          <Button
            variant="subtle"
            onClick={() => {
              cardsFunction(true);
              setFunction(collection);
            }}
            color="gray"
            sx={{ "&:hover": { background: "transparent" } }}
          >
            <Group>
              <Title order={4}>Edit cards</Title>
              <IconChevronRight strokeWidth={3} />
            </Group>
          </Button>
        </Group>
      </Paper>
    </>
  );
}

export default EditCollectionFolder;
