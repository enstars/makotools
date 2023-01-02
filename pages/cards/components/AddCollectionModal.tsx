import { Modal } from "@mantine/core";

export default function AddCollectionModal({
  opened,
  onClose,
}: {
  opened: boolean;
  onClose: () => any;
}) {
  return (
    <Modal opened={opened} onClose={onClose}>
      Add collection
    </Modal>
  );
}
