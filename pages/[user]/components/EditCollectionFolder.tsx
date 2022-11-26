import {
  Paper,
  Group,
  Menu,
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
  Box,
} from "@mantine/core";
import { UseListStateHandlers } from "@mantine/hooks";
import {
  IconDots,
  IconCheck,
  IconEye,
  IconX,
  IconTrash,
  IconChevronRight,
  IconChevronUp,
} from "@tabler/icons";
import { Dispatch, SetStateAction, useState } from "react";

import { CardCollection } from "types/makotools";

function EditCollectionFolder({
  collection,
  index,
  icons,
  handlers,
  defaultCollection,
  cardsFunction,
  setFunction,
  defaultFunction,
}: {
  collection: CardCollection;
  index: number;
  icons: JSX.Element[];
  handlers: UseListStateHandlers<CardCollection>;
  defaultCollection: CardCollection | null;
  cardsFunction: Dispatch<SetStateAction<boolean>>;
  setFunction: Dispatch<SetStateAction<CardCollection>>;
  defaultFunction: Dispatch<SetStateAction<CardCollection | null>>;
}) {
  const theme = useMantineTheme();

  const [focused, setFocused] = useState<string>("");
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);

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
      <Paper withBorder>
        <Group position="apart">
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
                          parseInt(value as string)
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
