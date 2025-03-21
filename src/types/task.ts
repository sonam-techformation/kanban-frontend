export interface TaskProps {
  task: {
    title: string;
    id: number;
    description: string;
    position: string;
  };
  moveTask: (
    taskId: number,
    fromColumnId: number,
    toColumnId: number,
    droppedIndex: number
  ) => void;
  columnId: number;
}
