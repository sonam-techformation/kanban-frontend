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
      <div className="border border-gray-200 p-6 rounded-lg">
        <Link href={`/list/${boardId}`}>
          <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-4">
            <svg
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-6 h-6"
              viewBox="0 0 24 24"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
            </svg>
          </div>
          <h2 className="text-lg text-gray-900 font-medium title-font mb-2">
            {name || "Board"}
          </h2>
        </Link>
        <div className="flex flex-1/2 justify-end">
          <div className="mx-0.5">
            <button
              className=" bg-indigo-500 border-0 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={onEdit}
            >
              Edit
            </button>
          </div>
          <div className="mx-0.5">
            <button
              className=" bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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
