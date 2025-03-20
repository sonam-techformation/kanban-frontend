"use";
import React, { useEffect, useState } from "react";
import {
  DndContext,
  useDroppable,
  useDraggable,
  closestCenter,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  sortableKeyboardCoordinates,
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

interface Task {
  id: number;
  title: string;
  description: string;
  position: number;
}

interface Column {
  id: number;
  board_id: number;
  name: string;
  position: string;
  tasks: Task[];
}

interface KanbanBoardProps {
  initialData: Column[];
  addTask: () => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ initialData, addTask }) => {
  const [data, setData] = useState<Column[]>(initialData);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  // Set up the sensors for mouse, keyboard, and touch
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
    useSensor(TouchSensor)
  );

  // Handle drag end event
  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeColumnId = activeId.split("-")[0];
    const overColumnId = overId.split("-")[0];

    // If tasks are moved within the same column
    if (activeColumnId === overColumnId) {
      const column = data.find((col) => col.id === parseInt(activeColumnId));
      if (!column) return;

      const newTasks = arrayMove(
        column.tasks,
        column.tasks.findIndex(
          (task) => task.id === parseInt(activeId.split("-")[1])
        ),
        column.tasks.findIndex(
          (task) => task.id === parseInt(overId.split("-")[1])
        )
      );

      setData(
        data.map((col) =>
          col.id === parseInt(activeColumnId)
            ? { ...col, tasks: newTasks }
            : col
        )
      );
    } else {
      // Move task between columns
      const activeColumn = data.find(
        (col) => col.id === parseInt(activeColumnId)
      );
      const overColumn = data.find((col) => col.id === parseInt(overColumnId));

      if (!activeColumn || !overColumn) return;

      const activeTask = activeColumn.tasks.find(
        (task) => task.id === parseInt(activeId.split("-")[1])
      );

      if (!activeTask) return;

      // Remove task from active column
      const newActiveTasks = activeColumn.tasks.filter(
        (task) => task.id !== parseInt(activeId.split("-")[1])
      );

      // Add task to over column
      const newOverTasks = [...overColumn.tasks, activeTask];

      setData(
        data.map((col) => {
          if (col.id === parseInt(activeColumnId)) {
            return { ...col, tasks: newActiveTasks };
          }
          if (col.id === parseInt(overColumnId)) {
            return { ...col, tasks: newOverTasks };
          }
          return col;
        })
      );
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div style={{ display: "flex", gap: "1rem" }}>
        {data?.map((column) => (
          <Column
            key={column.id}
            column={column}
            tasks={column.tasks}
            addTask={addTask}
          />
        ))}
      </div>
    </DndContext>
  );
};

interface ColumnProps {
  column: Column;
  tasks: Task[];
  addTask: () => void;
}

const Column: React.FC<ColumnProps> = ({ column, tasks, addTask }) => {
  const { setNodeRef: setColumnRef } = useDroppable({
    id: `column-${column.id}`,
  });

  const {
    attributes,
    listeners,
    setNodeRef: setColumnDraggableRef,
    transform,
  } = useDraggable({
    id: `column-${column.id}`,
  });

  return (
    <div
      ref={setColumnDraggableRef}
      {...listeners}
      {...attributes}
      style={{
        width: "auto",
        padding: "1rem",
        backgroundColor: "#f4f5f7",
        borderRadius: "4px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        transform: `translate3d(${transform?.x}px, ${transform?.y}px, 0)`,
      }}
    >
      <div ref={setColumnRef}>
        <h3>{column.name}</h3>
        <button type="button" onClick={addTask}>
          Add Task
        </button>
        <SortableContext
          id={`column-${column.id}`}
          items={tasks.map((task) => task.id.toString())}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <Task key={task.id} task={task} columnId={column.id} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};

interface TaskProps {
  task: Task;
  columnId: number;
}

const Task: React.FC<TaskProps> = ({ task, columnId }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `${columnId}-${task.id}`,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        padding: "10px",
        marginBottom: "8px",
        backgroundColor: "white",
        borderRadius: "4px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        transform: `translate3d(${transform?.x}px, ${transform?.y}px, 0)`,
      }}
    >
      <div className="flex flex-col">
        <p>{task.title}</p>
        <p>{task.description}</p>
        <button type="button">Edit</button>
        <button type="button">Delete</button>
      </div>
    </div>
  );
};

export default KanbanBoard;
