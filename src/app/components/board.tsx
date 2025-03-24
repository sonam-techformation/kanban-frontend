import { boardColor, borderColor, textColor } from "@/utils/color";
import { useTheme } from "next-themes";
import Link from "next/link";
import { MdModeEditOutline } from "react-icons/md";
import { RiDeleteBin5Fill } from "react-icons/ri";

interface BoardProps {
  name?: string;
  boardId?: number;
  onEdit: () => void;
  onDelete: () => void;
}

export default function Board({ name, boardId, onEdit, onDelete }: BoardProps) {
  const { theme } = useTheme();
  return (
    <div className="p-4 w-xs md:w:sm">
      <div
        className={`border ${borderColor(
          theme
        )} px-5 py-3 rounded-lg ${boardColor(theme)}}`}
      >
        <Link href={`/dashboard/list/${boardId}`}>
          <h2
            className={`text-sm ${textColor(theme)}font-bold title-font mb-2 `}
          >
            {name
              ? name.replace(/\b\w/g, (char) => char.toUpperCase())
              : "Board"}
          </h2>
        </Link>
        <div className="flex flex-1/2 justify-end">
          <div className="mx-0.5">
            <button
              className=" bg-indigo-600 border-0 hover:bg-indigo-700 text-white font-bold py-1 px-1 rounded focus:outline-none focus:shadow-outline text-xs"
              type="button"
              onClick={onEdit}
            >
              <MdModeEditOutline />
            </button>
          </div>
          <div className="mx-0.5">
            <button
              className=" bg-red-700 hover:bg-red-800 text-white font-bold py-1 px-1 rounded focus:outline-none focus:shadow-outline text-xs"
              type="button"
              onClick={onDelete}
            >
              <RiDeleteBin5Fill />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
