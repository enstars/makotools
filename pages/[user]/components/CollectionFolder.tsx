import {
  Accordion,
  ActionIcon,
  Box,
  Button,
  Group,
  Indicator,
  Menu,
  TextInput,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { IconCircle, IconPencil, IconTrash } from "@tabler/icons";
import { useEffect, useState } from "react";

import CollectionCard from "./CollectionCard";

import { CollectedCard, UserData } from "types/makotools";

function CollectionFolder({
  profile,
  editing,
}: {
  profile: UserData;
  editing: boolean;
}) {
  const [focused, setFocused] = useState<string>("");
  const [color, setColor] = useState<string>("#D3D6E0");

  const theme = useMantineTheme();

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

  useEffect(() => {
    setFocused("");
  }, [editing]);

  return (
    <Accordion variant="contained" defaultValue="default">
      <Accordion.Item value="default">
        <Accordion.Control>
          <Group>
            {editing ? (
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
            ) : (
              <IconCircle fill={color} size={20} stroke={0} />
            )}
            {editing ? (
              <TextInput
                id="field-0"
                aria-label="Input collection name"
                placeholder="Input collection name"
                onFocus={(event) => setFocused(event.target.id)}
                onBlur={(event) => setFocused("")}
              />
            ) : (
              <Title order={4}>Collection #1</Title>
            )}
            {editing && (
              <Button color="indigo" leftIcon={<IconTrash />}>
                Delete collection
              </Button>
            )}
          </Group>
        </Accordion.Control>
        <Accordion.Panel>
          <Box
            sx={(theme) => ({
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
              gap: theme.spacing.xs,
            })}
          >
            {profile.collection
              ?.filter((c: CollectedCard) => c.count)
              .sort((a: CollectedCard, b: CollectedCard) => b.count - a.count)
              .map((c: CollectedCard) => (
                <CollectionCard key={c.id} card={c} editing={editing} />
              ))}
          </Box>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}

export default CollectionFolder;
