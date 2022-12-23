import { Box, Group, Input, Modal, Select, Text, Title } from "@mantine/core";
import { useState } from "react";

import { GameCard } from "types/game";
import { ProfilePicture, User, UserData } from "types/makotools";

function ProfilePicModal({
  opened,
  openedFunction,
  cards,
  user,
  profile,
}: {
  opened: boolean;
  openedFunction: any;
  cards: GameCard[];
  user: User;
  profile: UserData;
}) {
  const [picId, setPicId] = useState<ProfilePicture | null>(
    (user.loggedIn && user.db?.profile__picture) || null
  );
  return (
    <Modal
      opened={opened}
      size="lg"
      onClose={() => openedFunction(false)}
      title={<Title order={2}>Update avatar</Title>}
      styles={(theme) => ({
        modal: { height: "100%", minHeight: "100%" },
      })}
    >
      <Group>
        <Box>
          <Text>Current avatar</Text>
        </Box>
        <Input.Wrapper label="Avatar image">
          <Select
            placeholder="Type to search for a card"
            searchable
            limit={25}
            data={[
              {
                value: "-",
                label: "Start typing to search for a card...",
                disabled: true,
              },
              ...cards
                .filter((c) => c.title)
                .filter((c) => Math.abs(c.id) !== Math.abs(picId?.id as number))
                .map((c) => ({
                  value: c.id.toString(),
                  label: `(${c.title[0]}) ${c.name && c.name[0]}`,
                })),
            ]}
          />
        </Input.Wrapper>
      </Group>
    </Modal>
  );
}

export default ProfilePicModal;
