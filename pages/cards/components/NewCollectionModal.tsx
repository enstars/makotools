import { Group, Modal, Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

import { COLLECTION_PRIVACY_LEVEL_DESCRIPTION } from "services/makotools/collection";

export default function NewCollectionModal({
  opened,
  onClose,
  onNewCollection,
}: {
  opened: boolean;
  onClose: () => any;
  onNewCollection: () => any;
}) {
  const form = useForm({
    initialValues: { name: "", privacyLevel: "1", icon: 0 },
  });

  console.log(form.values);

  return (
    <Modal opened={opened} onClose={onClose}>
      <Stack spacing="md">
        <Group spacing="md">
          <TextInput
            label="Collection name"
            aria-label="Collection name"
            {...form.getInputProps("name")}
          />
        </Group>
        <Select
          label="Privacy level"
          aria-label="Privacy level"
          data={[
            {
              value: "0",
              label: COLLECTION_PRIVACY_LEVEL_DESCRIPTION[0],
            },
            {
              value: "1",
              label: COLLECTION_PRIVACY_LEVEL_DESCRIPTION[1],
            },
            {
              value: "2",
              label: COLLECTION_PRIVACY_LEVEL_DESCRIPTION[2],
            },
            {
              value: "3",
              label: COLLECTION_PRIVACY_LEVEL_DESCRIPTION[3],
            },
          ]}
          {...form.getInputProps("privacyLevel")}
        />
      </Stack>
    </Modal>
  );
}
