import { ReactNode } from "react";

export interface ModalProps {
  modalTitle: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}
