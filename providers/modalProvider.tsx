"use client";

import { useEffect, useState } from "react";

import { StoreModal } from "@/components/modals/store-modal";

// Will check to see if component is mounted to prevent hydration errors in Next.js
// Modal rendering on client side can desynchronized when using in server components
export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <StoreModal />
    </>
  );
};
