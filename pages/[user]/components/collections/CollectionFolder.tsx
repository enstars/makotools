import {
  Accordion,
  Box,
  Button,
  Group,
  Stack,
  Text,
  ThemeIcon,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import Link from "next/link";
import { IconUsers, IconHeart, IconEyeOff, IconEye } from "@tabler/icons";

import CollectionCard from "./CollectionCard";

import { CollectionIcons } from "components/collections/CollectionIcons";

import { CardCollection, CollectedCard } from "types/makotools";

function CollectionFolder({
  collection,
  isYourProfile,
}: {
  collection: CardCollection;
  isYourProfile: boolean | undefined;
}) {
  const theme = useMantineTheme();

  const ICON_STYLE = {
    borderRadius: theme.radius.lg,
  };

  const icon = CollectionIcons[collection.icon || 0];

  return (
    <Accordion.Item value={collection.id}>
      <Accordion.Control py="xs" px="md">
        <Group noWrap>
          <Text color={icon.color} inline>
            <icon.component {...icon.props} />
          </Text>
          <Box>
            <Text size="md" weight={800}>
              {collection.name}
            </Text>
            <Text size="xs" weight={500} color="dimmed">
              {collection.cards.length} cards in collection
            </Text>
          </Box>
          {isYourProfile &&
            (collection.privacyLevel === 1 ? (
              <Tooltip
                label="Only logged in users can view this collection."
                withArrow
              >
                <ThemeIcon variant="light" color="lime" sx={ICON_STYLE}>
                  <IconUsers size={20} />
                </ThemeIcon>
              </Tooltip>
            ) : collection.privacyLevel === 2 ? (
              <Tooltip
                label="Only your friends can view this collection."
                withArrow
              >
                <ThemeIcon variant="light" color="pink" sx={ICON_STYLE}>
                  <IconHeart size={20} />
                </ThemeIcon>
              </Tooltip>
            ) : collection.privacyLevel === 3 ? (
              <Tooltip label="This collection is completely private." withArrow>
                <ThemeIcon variant="light" color="gray" sx={ICON_STYLE}>
                  <IconEyeOff size={20} />
                </ThemeIcon>
              </Tooltip>
            ) : (
              <Tooltip label="Anyone can view this collection." withArrow>
                <ThemeIcon sx={ICON_STYLE}>
                  <IconEye size={20} />
                </ThemeIcon>
              </Tooltip>
            ))}
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
