import queryClient from "@/lib/react-query";
import { ItemType } from "@/types/enum";
import { TaskProps } from "@/types/task";
import { useMutation } from "@tanstack/react-query";
import { useDrag } from "react-dnd";
import { deleteTaskFromList } from "../api/taskApi";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { listTextColor } from "@/utils/color";
import { useTheme } from "next-themes";

export const Task: React.FC<TaskProps> = ({ task, moveTask, columnId }) => {
  const { theme } = useTheme();
  const [{ isDragging }, drag] = useDrag({
    type: ItemType.TASK,
    item: { task, columnId },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const deleteTask = (id: any) => {
    deleteTasks.mutate(id);
  };

  const deleteTasks = useMutation({
    mutationFn: async (id: any) => {
      await deleteTaskFromList(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["list"], exact: true });
    },
  });

  return (
    <div
      ref={drag as unknown as React.Ref<HTMLDivElement>}
      className={`p-2 bg-white shadow rounded mb-2 ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div className="flex justify-between items-center content-center">
        <div>
          <p className={`${listTextColor(theme)} font-bold text-sm`}>
            {task.title
              ? task.title.replace(/\b\w/g, (char) => char.toUpperCase())
              : ""}
          </p>
          <p className={`${listTextColor(theme)} font-normal text-xs`}>
            {task.description}
          </p>
        </div>
        <div>
          <button
            type="button"
            onClick={() => deleteTask(task.id)}
            className="bg-red-700 border-0 py-1 px-1 focus:outline-none hover:bg-red-700 text-white rounded text-xs"
          >
            <RiDeleteBin5Fill />
          </button>
        </div>
      </div>
    </div>
  );
};
