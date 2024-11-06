import {
  ActionIcon,
  Box,
  Button,
  Group,
  Modal,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconChevronUp } from "@tabler/icons-react";
import { UseMutationResult } from "@tanstack/react-query";

import { COLLECTION_ICONS } from "components/collections/collectionIcons";
import CollectionIconsMenu from "components/collections/CollectionIconsMenu";
import PRIVACY_LEVELS from "components/collections/privacyLevels";
import { MAX_COLLECTION_NAME_LENGTH } from "services/makotools/collection";
import { CollectionPrivacyLevel } from "types/makotools";

export default function NewCollectionModal({
  opened,
  onClose,
  createCollection,
}: {
  opened: boolean;
  onClose: () => any;
  createCollection: UseMutationResult<
    void,
    Error,
    {
      name: string;
      privacyLevel: 0 | 1 | 2 | 3;
      icon: number;
    },
    unknown
  >;
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

  const icon = COLLECTION_ICONS[form.values.icon || 0];

  return (
    <Modal opened={opened} onClose={onClose}>
      <form
        onSubmit={form.onSubmit((values) => {
          createCollection.mutate(values);
          onClose();
        })}
      >
        <Stack spacing="md">
          <Title order={4}>Create new collection</Title>
          <Group spacing="md">
            <Box sx={{ marginTop: "26px" }}>
              <CollectionIconsMenu
                target={
                  <ActionIcon
                    sx={{
                      display: "flex",
                      flexFlow: "row no-wrap",
                      alignItems: "center",
                      width: "auto",
                      height: "auto",
                      minHeight: 0,
                    }}
                  >
                    <Text color={icon.color}>
                      <icon.component {...icon.props} />
                    </Text>
                    <IconChevronUp size={16} />
                  </ActionIcon>
                }
                {...form.getInputProps("icon")}
              />
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
            data={PRIVACY_LEVELS.map((level) => ({
              value: level.value.toString(),
              label: level.description,
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
