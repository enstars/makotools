import {
  Accordion,
  Box,
  Button,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import Link from "next/link";

import CollectionCard from "./CollectionCard";

import { CardCollection, CollectedCard } from "types/makotools";

function CollectionFolder({
  collection,
  icons,
}: {
  collection: CardCollection;
  icons: JSX.Element[];
}) {
  return (
    <Accordion.Item value={collection.name}>
      <Accordion.Control>
        <Group noWrap>
          {icons[collection.icon || 0]}
          <Title order={4}>{collection.name}</Title>
        </Group>
      </Accordion.Control>
      <Accordion.Panel>
        {collection.cards && collection.cards.length > 0 ? (
          <Box
            sx={(theme) => ({
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
              gap: theme.spacing.xs,
            })}
          >
            {collection.cards
              .filter((c: CollectedCard) => c.count)
              .sort((a: CollectedCard, b: CollectedCard) => b.count - a.count)
              .map((c: CollectedCard) => (
                <CollectionCard key={c.id} card={c} editing={false} />
              ))}
          </Box>
        ) : (
          <Stack align="flex-start">
            <Text color="dimmed">This collection is empty.</Text>
            <Button variant="outline" component={Link} href="/cards">
              Add some cards!
            </Button>
          </Stack>
        )}
      </Accordion.Panel>
    </Accordion.Item>
  );
}

export default CollectionFolder;
