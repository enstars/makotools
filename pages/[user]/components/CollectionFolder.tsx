import {
  Accordion,
  ActionIcon,
  AspectRatio,
  Badge,
  Box,
  Button,
  Group,
  Image,
  Paper,
  Stack,
  Switch,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconCircle, IconTrash, IconX } from "@tabler/icons";
import Link from "next/link";
import { useEffect, useState } from "react";

import { getAssetURL } from "services/data";
import { CollectedCard, UserData } from "types/makotools";

function CollectionFolder({
  profile,
  editing,
}: {
  profile: UserData;
  editing: boolean;
}) {
  const [focused, setFocused] = useState<string>("");

  useEffect(() => {
    setFocused("");
  }, [editing]);

  return (
    <Accordion variant="contained" defaultValue="default">
      <Accordion.Item value="default">
        <Accordion.Control>
          <Group>
            <IconCircle fill="#D3D6E0" size={16} />
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
                <Stack key={c.id} spacing="xs">
                  <Box sx={{ position: "relative" }}>
                    {editing && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 1,
                          right: 1,
                          zIndex: 3,
                        }}
                      >
                        <ActionIcon variant="filled" color="dark" radius="lg">
                          <IconX />
                        </ActionIcon>
                      </Box>
                    )}
                    <Paper
                      radius="sm"
                      component={Link}
                      href={`/cards/${Math.abs(c.id)}`}
                      withBorder
                      sx={{ position: "relative" }}
                    >
                      <AspectRatio ratio={4 / 5}>
                        <Image
                          radius="sm"
                          alt={"card image"}
                          withPlaceholder
                          src={getAssetURL(
                            `assets/card_rectangle4_${Math.abs(c.id)}_${
                              c.id < 0 ? "normal" : "evolution"
                            }.png`
                          )}
                        />
                      </AspectRatio>
                      {c.count > 1 && (
                        <Badge
                          sx={{ position: "absolute", bottom: 4, left: 4 }}
                          variant="filled"
                        >
                          <Text inline size="xs" weight="700">
                            {c.count}
                            <Text
                              component="span"
                              sx={{ verticalAlign: "-0.05em", lineHeight: 0 }}
                            >
                              ×
                            </Text>
                          </Text>
                        </Badge>
                      )}
                    </Paper>
                  </Box>
                  {editing && (
                    <Switch
                      aria-label="Set bloomed"
                      onLabel="Bloomed"
                      offLabel="Unbloomed"
                      size="xl"
                      sx={{ marginTop: 0 }}
                    />
                  )}
                </Stack>
              ))}
          </Box>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}

export default CollectionFolder;
