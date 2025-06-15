"use client";

import { useContext } from "react";
import { ModalContext } from "@/providers/modal";

export function useDrawer() {
  return useContext(ModalContext);
}
