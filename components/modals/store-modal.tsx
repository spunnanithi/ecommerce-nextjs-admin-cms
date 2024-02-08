"use client";

import { useStoreModal } from "@/hooks/useStoreModal";
import { Modal } from "@/components/reuseable/modal";

export const StoreModal = () => {
  const storeModal = useStoreModal();

  return (
    <Modal
      title="Create Store Form"
      description="Add a new store to manage products and categories."
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      Future Create Store Form
    </Modal>
  );
};
