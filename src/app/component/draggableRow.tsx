"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensors,
  useSensor,
  UniqueIdentifier,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { apiRequest } from "../api/interceptor";

const API_URL = `http://localhost:3000`;

interface Item {
  id: string;
  content: string;
  tasks: Task[];
}

interface Task {
  id: number;
  title: string;
  description: string;
}

const DraggableRow = ({ items: initialItems }: { items: Item[] }) => {
  const [items, setItems] = useState(initialItems);
  const [tasks, setTasks] = useState<{ [listId: string]: Task[] }>({});

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (
      active.id !== over?.id &&
      active.data.current?.type === "list" &&
      over?.data.current?.type === "list"
    ) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over?.id);
      setItems((items) => arrayMove(items, oldIndex, newIndex));
    }

    if (active.data.current?.type === "task" && over) {
      const activeTask = active.data.current.task;
      const activeListId = active.data.current.listId;
      const overListId = over.data.current?.listId;
      const overTaskId = over.id;

      setTasks((prevTasks) => {
        const newTasks = { ...prevTasks };
        const activeTasks = newTasks[activeListId].filter(
          (task) => task.id !== activeTask.id
        );
        let overTasks = newTasks[overListId] || [];

        const overIndex = overTasks.findIndex((task) => task.id === overTaskId);
        if (overIndex >= 0) {
          overTasks.splice(overIndex, 0, activeTask);
        } else {
          overTasks = [...overTasks, activeTask];
        }

        newTasks[activeListId] = activeTasks;
        newTasks[overListId] = overTasks;
        return newTasks;
      });
    }
  };

  const SortableItem = ({
    id,
    content,
    tasks,
  }: {
    id: string;
    content: string;
    tasks: Task[];
  }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id: id, data: { listId: id, type: "list" } });
    const isMounted = useRef(false);

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      marginRight: "10px",
      padding: "10px",
      border: "1px solid #ccc",
      borderRadius: "4px",
      backgroundColor: "#f0f0f0",
      cursor: "grab",
      display: "inline-block",
      verticalAlign: "top",
      minWidth: "200px",
    };

    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        {content}
        {/* <SortableContext
          items={tasks[id]?.map((task) => task.id) || []}
          strategy={horizontalListSortingStrategy}
        > */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "10px",
            minHeight: "50px",
          }}
        >
          {tasks?.map((task: any) => (
            <SortableTask
              key={task.id}
              id={task.id}
              content={{ title: task.title, description: task.description }}
              listId={id}
            />
          ))}
        </div>
        {/* </SortableContext> */}
      </div>
    );
  };

  const SortableTask = ({
    id,
    content: { title, description },
    listId,
  }: {
    id: number;
    content: { title: string; description: string };
    listId: string;
  }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({
        id: id,
        data: { task: { id, title, description }, listId, type: "task" },
      });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      marginRight: "5px",
      marginBottom: "10px",
      padding: "5px",
      border: "1px solid #ddd",
      borderRadius: "4px",
      backgroundColor: "#e8e8e8",
      cursor: "grab",
      display: "flex",
    };

    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    );
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((item) => item.id)}
        strategy={horizontalListSortingStrategy}
      >
        <div style={{ display: "flex", overflowX: "auto", padding: "10px" }}>
          {items.map((item) => (
            <SortableItem
              key={item.id}
              id={item.id}
              content={item.content}
              tasks={item.tasks}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default DraggableRow;
