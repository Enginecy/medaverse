"use client";

import { Sheet } from "@/components/ui/sheet";
import { createContext, useState } from "react";

export const ModalContext = createContext<{
  openDrawer: (drawer: React.ReactNode, onClose?: () => void) => void;
  closeDrawer: () => void;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
}>({ openDrawer: () => {}, closeDrawer: () => {} });

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [drawer, setDrawer] = useState<React.ReactNode | null>(null);
  const [open, setOpen] = useState(false);
  const [onDrawerClose, setOnDrawerClose] = useState<(() => void) | null>(null);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen && onDrawerClose) {
      onDrawerClose();
      setOnDrawerClose(null);
      setDrawer(null);
    }
  };

  return (
    <ModalContext.Provider
      value={{
        openDrawer: (drawer, onClose) => {
          setDrawer(drawer);
          setOpen(true);
          setOnDrawerClose(() => onClose ?? null);
        },
        closeDrawer: () => setOpen(false),
      }}
    >
      {children}
      <Sheet open={open} onOpenChange={handleOpenChange}>
        {drawer}
      </Sheet>
    </ModalContext.Provider>
  );
}
