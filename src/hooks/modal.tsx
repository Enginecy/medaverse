"use client";

import { useContext } from "react";
import { ModalContext } from "@/providers/modal";

export function useModals() {
  return useContext(ModalContext);
}
