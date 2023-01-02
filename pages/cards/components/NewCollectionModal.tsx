import {
  Box,
  Button,
  Group,
  Modal,
  Select,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";

import CollectionIconMenu from "components/collections/CollectionIconMenu";
import {
  COLLECTION_PRIVACY_LEVEL_DESCRIPTION,
  MAX_COLLECTION_NAME_LENGTH,
} from "services/makotools/collection";
import { CardCollection, CollectionPrivacyLevel } from "types/makotools";

export default function NewCollectionModal({
  opened,
  onClose,
  onNewCollection,
}: {
  opened: boolean;
  onClose: () => any;
  onNewCollection: (
    values: Pick<CardCollection, "name" | "privacyLevel" | "icon">
  ) => any;
}) {
  const form = useForm({
    initialValues: {
      name: "",
      privacyLevel: 1 as CollectionPrivacyLevel,
      icon: 0,
    },
    validate: {
      name: (value) =>
        !value
          ? "Required"
          : value.length > MAX_COLLECTION_NAME_LENGTH
          ? `Name can be at most ${MAX_COLLECTION_NAME_LENGTH} characters`
          : null,
    },
    validateInputOnChange: true,
  });

  return (
    <Modal opened={opened} onClose={onClose}>
      <form
        onSubmit={form.onSubmit((values) => {
          onNewCollection(values);
          onClose();
        })}
      >
        <Stack spacing="md">
          <Title order={4}>Create new collection</Title>
          <Group spacing="md">
            <Box sx={{ marginTop: "26px" }}>
              <CollectionIconMenu {...form.getInputProps("icon")} />
            </Box>
            <TextInput
              label="Collection name"
              aria-label="Collection name"
              sx={{ flexGrow: 1 }}
              {...form.getInputProps("name")}
            />
          </Group>
          <Select
            label="Privacy level"
            aria-label="Privacy level"
            data={[0, 1, 2, 3].map((level) => ({
              value: level,
              label: COLLECTION_PRIVACY_LEVEL_DESCRIPTION[level],
            }))}
            {...form.getInputProps("privacyLevel")}
          />
          <Button
            type="submit"
            sx={{ width: "50%", alignSelf: "center", marginTop: "24px" }}
          >
            Submit
          </Button>
        </Stack>
      </form>
    </Modal>
  );
}
