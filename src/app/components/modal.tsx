"use client";
import { ModalProps } from "@/types/modal";
import { bgColor } from "@/utils//color";
import { useTheme } from "next-themes";
import React, { useEffect, useRef } from "react";
import Button from "./button";
import { MdClose } from "react-icons/md";

const Modal = ({ modalTitle, isOpen, onClose, children }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-200 opacity-85">
        <div
          ref={modalRef}
          className={`${bgColor(theme)} rounded-lg p-6 w-full max-w-md`}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-semibold">{modalTitle}</h2>

            <Button
              type="button"
              onClick={onClose}
              icon={<MdClose />}
              className="text-gray-500 hover:text-gray-700"
            />
          </div>
          {children}
        </div>
      </div>
    </>
  );
};

export default Modal;
