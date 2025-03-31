export interface TaskProps {
  task: {
    title: string;
    id: number;
    description: string;
    position: string;
    assignTo: string;
  };
  moveTask: (
    taskId: number,
    fromColumnId: number,
    toColumnId: number,
    droppedIndex: number
  ) => void;
  boardOwnerId: number;
  columnId: number;
}
