import { Box, Button, Group, Stack, Text, Title } from "@mantine/core";
import { IconDeviceFloppy, IconPencil, IconPlus } from "@tabler/icons";
import { useState } from "react";

import CollectionFolder from "./CollectionFolder";

import { User, UserData } from "types/makotools";

function CardCollections({ user, profile }: { user: User; profile: UserData }) {
  const [editMode, setEditMode] = useState<boolean>(false);
  const isYourProfile = user.loggedIn && user.db.suid === profile.suid;

  return (
    <Box>
      <Group>
        <Title order={2} mt="md" mb="xs">
          Collections
        </Title>
        {isYourProfile && (
          <Button
            color="indigo"
            radius="xl"
            variant="subtle"
            leftIcon={editMode ? <IconDeviceFloppy /> : <IconPencil />}
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? "Save" : "Edit"}
          </Button>
        )}
      </Group>
      {!profile?.collection?.length ? (
        <Text color="dimmed" size="sm">
          This user has no card collections.
          {isYourProfile && (
            <Button color="indigo" variant="outline" leftIcon={<IconPlus />}>
              Create a collection
            </Button>
          )}
        </Text>
      ) : (
        <Stack align="stretch">
          {editMode && (
            <Button color="indigo" variant="outline" leftIcon={<IconPlus />}>
              Add collection
            </Button>
          )}
          <CollectionFolder profile={profile} editing={editMode} />
        </Stack>
      )}
    </Box>
  );
}

export default CardCollections;
