export interface ColumnProps {
  column: {
    id: number;
    name: string;
    tasks: {
      id: number;
      title: string;
      description: string;
      position: string;
    }[];
    position: string;
  };
  moveTask: (
    taskId: number,
    fromColumnId: number,
    toColumnId: number,
    droppedIndex: number
  ) => void;
  moveColumn: (fromColumnId: number, toColumnId: number) => void;
}
