import { Paper, Group, Button, Title } from "@mantine/core";
import { UseListStateHandlers } from "@mantine/hooks";
import { IconChevronRight } from "@tabler/icons";
import { Dispatch, SetStateAction } from "react";

import { CardCollection } from "types/makotools";

function EditCollectionFolder({
  collection,
  index,
  handlers,
  setFunction,
  icons,
  defaultCollection,
  defaultFunction,
}: {
  collection: CardCollection;
  index: number;
  handlers: UseListStateHandlers<CardCollection>;
  setFunction: Dispatch<SetStateAction<CardCollection>>;
  icons: JSX.Element[];
  defaultCollection: CardCollection | null;
  defaultFunction: Dispatch<SetStateAction<CardCollection | null>>;
}) {
  return (
    <>
      <Paper withBorder>
        <Group position="apart">
          {collection.name}
          <Button
            variant="subtle"
            onClick={() => {
              setFunction(collection);
            }}
            color="gray"
            sx={{ "&:hover": { background: "transparent" } }}
          >
            <Group>
              <Title order={4}>Edit cards</Title>
              <IconChevronRight strokeWidth={3} />
            </Group>
          </Button>
        </Group>
      </Paper>
    </>
  );
}

export default EditCollectionFolder;
