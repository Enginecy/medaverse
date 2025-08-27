"use client";

import { Sheet } from "@/components/ui/sheet";
import { createContext, useState } from "react";
import { Dialog } from "@/components/ui/dialog";

export const ModalContext = createContext<{
  openDrawer: (drawer: React.ReactNode, onClose?: () => void) => void;
  closeDrawer: () => void;
  openDialog: (dialog: React.ReactNode, onClose?: () => void) => void;
  closeDialog: () => void;
}>({
  openDrawer: () => {
    throw new Error("openDrawer function not implemented");
  },
  closeDrawer: () => {
    throw new Error("closeDrawer function not implemented");
  },
  openDialog: () => {
    throw new Error("openDialog function not implemented");
  },
  closeDialog: () => {
    throw new Error("closeDialog function not implemented");
  },
});

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [drawer, setDrawer] = useState<React.ReactNode | null>(null);
  const [dialog, setDialog] = useState<React.ReactNode | null>(null);

  const [openDrawer, setOpenDrawer] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const [onDrawerClose, setOnDrawerClose] = useState<(() => void) | null>(null);

  const handleOpenDialogChange = (isOpen: boolean) => {
    setOpenDialog(isOpen);
    if (!isOpen) {
      setDialog(null);
    }
  };

  const handleOpenDrawerChange = (isOpen: boolean) => {
    setOpenDrawer(isOpen);
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
          setOpenDrawer(true);
          setOnDrawerClose(() => onClose ?? null);
        },
        closeDrawer: () => setOpenDrawer(false),
        openDialog: (dialog, onClose) => {
          setDialog(dialog);
          setOpenDialog(true);
          setOnDrawerClose(() => onClose ?? null);
        },
        closeDialog: () => setOpenDialog(false),
      }}
    >
      {children}
      <Sheet open={openDrawer} onOpenChange={handleOpenDrawerChange}>
        {drawer}
      </Sheet>
      <Dialog open={openDialog} onOpenChange={handleOpenDialogChange}>
        {dialog}
      </Dialog>
    </ModalContext.Provider>
  );
}
