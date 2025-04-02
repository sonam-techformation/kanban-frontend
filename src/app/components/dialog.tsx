import { bgColor } from "@/utils/color";
import Button from "./button";
import { useTheme } from "next-themes";
import { MdClose } from "react-icons/md";

interface DialogBoxProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean; // If true, will style confirm button as dangerous action
}

const DialogBox = ({
  isOpen,
  title = "Confirm Deletion",
  message = "Are you sure you want to delete this item?",
  onConfirm,
  onCancel,
  confirmText = "Delete",
  cancelText = "Cancel",
  danger = true,
}: DialogBoxProps) => {
  const { theme } = useTheme();
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-gray-200 opacity-85 flex items-center justify-center z-50">
      <div className={`${bgColor(theme)} rounded-lg p-6 w-full max-w-md`}>
        <div className="flex justify-between items-center mb-4">
          {title && <h2 className="text-base font-semibold">{title}</h2>}
          <Button
            type="button"
            onClick={onCancel}
            icon={<MdClose />}
            className="text-gray-500 hover:text-gray-700"
          />
        </div>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            text={cancelText}
            onClick={onCancel}
            className=" bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline"
          />
          <Button
            type="button"
            text={confirmText}
            onClick={onConfirm}
            className=" bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline"
          />
        </div>
      </div>
    </div>
  );
};

export default DialogBox;
