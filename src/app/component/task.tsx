import { apiRequest } from "@/interceptor/interceptor";
import queryClient from "@/lib/react-query";
import { ItemType } from "@/types/enum";
import { TaskProps } from "@/types/task";
import { Constants } from "@/utils/constant";
import { useMutation } from "@tanstack/react-query";
import { useDrag } from "react-dnd";

export const Task: React.FC<TaskProps> = ({ task, moveTask, columnId }) => {
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

  // Mutation to create or update a board
  const deleteTasks = useMutation({
    mutationFn: async (id: any) => {
      const response = await apiRequest(
        `${Constants.API_URL}/tasks/${id}`,
        "delete"
      );
      return response;
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
          <p className="font-bold text-sm">{task.title}</p>
          <p className="font-normal text-xs">{task.description}</p>
        </div>
        <div>
          <button
            type="button"
            onClick={() => deleteTask(task.id)}
            className="bg-red-700 border-0 py-1 px-1 focus:outline-none hover:bg-red-700 text-white rounded text-xs"
          >
            delete
          </button>
        </div>
      </div>
    </div>
  );
};
