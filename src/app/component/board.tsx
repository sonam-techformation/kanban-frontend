import Link from "next/link";

interface BoardProps {
  name?: string;
  boardId?: number;
  onEdit: () => void;
  onDelete: () => void;
}

export default function Board({ name, boardId, onEdit, onDelete }: BoardProps) {
  return (
    <div className="p-4">
      <div className="border border-gray-300 px-5 py-3 rounded-lg bg-gray-200">
        <Link href={`/list/${boardId}`}>
          {/* <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-4">
            <svg
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-6 h-6"
              viewBox="0 0 24 24"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
            </svg>
          </div> */}
          <h2 className="text-sm text-gray-900 font-bold title-font mb-2 ">
            {name || "Board"}
          </h2>
        </Link>
        <div className="flex flex-1/2 justify-end">
          <div className="mx-0.5">
            <button
              className=" bg-indigo-600 border-0 hover:bg-indigo-700 text-white font-bold py-1 px-1 rounded focus:outline-none focus:shadow-outline text-xs"
              type="button"
              onClick={onEdit}
            >
              Edit
            </button>
          </div>
          <div className="mx-0.5">
            <button
              className=" bg-red-700 hover:bg-red-800 text-white font-bold py-1 px-1 rounded focus:outline-none focus:shadow-outline text-xs"
              type="button"
              onClick={onDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
