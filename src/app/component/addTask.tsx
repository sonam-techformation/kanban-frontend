"use client";
import React, { useState, useEffect } from "react";
interface Task {
  id: number;
  title: string;
  description: string;
  position: number;
}
interface AddTaskProps {
  task?: Task; // Optional for edit
  onSave: (task: Task) => void;
  onClose: () => void;
}

const AddTask: React.FC<AddTaskProps> = ({
  task: initialTask,
  onSave,
  onClose,
}) => {
  const [title, setTitle] = useState(initialTask?.title || "");
  const [description, setDescription] = useState(
    initialTask?.description || ""
  );
  const [id, setId] = useState(initialTask?.id || Date.now());

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description);
      setId(initialTask.id);
    }
  }, [initialTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ id, title, description, position: initialTask?.position || 0 }); // Assuming default position 0
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2"
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2"
      />
      <div className="flex justify-end gap-2">
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Save
        </button>
        <button type="button" onClick={onClose} className="border p-2 rounded">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddTask;
