import {
  Accordion,
  Box,
  Button,
  Group,
  Stack,
  Text,
  ThemeIcon,
  Title,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import Link from "next/link";
import {
  IconUsers,
  IconHeart,
  IconEyeOff,
  IconEye,
  IconCheck,
} from "@tabler/icons";

import CollectionCard from "./CollectionCard";

import { CardCollection, CollectedCard } from "types/makotools";

function CollectionFolder({
  collection,
  icons,
  isYourProfile,
}: {
  collection: CardCollection;
  icons: JSX.Element[];
  isYourProfile: boolean | undefined;
}) {
  const theme = useMantineTheme();

  const ICON_STYLE = {
    borderRadius: theme.radius.lg,
  };

  return (
    <Accordion.Item value={collection.name}>
      <Accordion.Control>
        <Group noWrap>
          {icons[collection.icon || 0]}
          <Title
            order={4}
            color={
              isYourProfile && collection.privacyLevel > 0 ? "dimmed" : "gray"
            }
          >
            {collection.name}
          </Title>
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
          {collection.default && (
            <Tooltip
              multiline
              width={200}
              label="This is your default collection. It will be automatically open when someone visits your profile"
              withArrow
            >
              <ThemeIcon color="green" sx={ICON_STYLE}>
                <IconCheck size={20} />
              </ThemeIcon>
            </Tooltip>
          )}
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
