export interface ColumnProps {
  column: {
    id: number;
    name: string;
    board_id: number;
    tasks: {
      id: number;
      title: string;
      description: string;
      position: string;
      assignTo: string;
    }[];
    position: string;
    owner?: {
      id: string;
    };
  };
  moveTask: (
    taskId: number,
    fromColumnId: number,
    toColumnId: number,
    droppedIndex: number
  ) => void;
  moveColumn: (fromColumnId: number, toColumnId: number) => void;
}
