import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Task } from "./task";
import { useDrag } from "react-dnd";
import { useTheme } from "next-themes";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import queryClient from "@/lib/react-query";

//Mock Dependencies

// Mock react-dnd
jest.mock("react-dnd", () => ({
  useDrag: jest.fn(() => [{ isDragging: false }, jest.fn()]),
}));

// Mock next-themes
jest.mock("next-themes", () => ({
  useTheme: jest.fn(() => ({ theme: "light" })),
}));

// Mock react-hot-toast
jest.mock("react-hot-toast", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock react-query
jest.mock("@tanstack/react-query", () => ({
  useMutation: jest.fn(),
}));

// Mock queryClient
jest.mock("@/lib/react-query", () => ({
  invalidateQueries: jest.fn(),
}));

// Mock API functions
jest.mock("../api/taskApi", () => ({
  deleteTaskFromList: jest.fn(),
  editTaskInList: jest.fn(),
}));

jest.mock("../api/taskAssignApi", () => ({
  updateAssignTask: jest.fn(),
}));

// Mock components
jest.mock("./Button", () =>
  jest.fn(({ onClick, icon }) => (
    <button
      onClick={onClick}
      data-testid={
        icon.type.name === "MdModeEditOutline" ? "edit-button" : "delete-button"
      }
    >
      {icon.type.name}
    </button>
  ))
);

jest.mock("./Modal", () => jest.fn(({ children }) => <div>{children}</div>));
jest.mock("./dialog", () =>
  jest.fn(({ isOpen }) => (isOpen ? <div>Dialog Content</div> : null))
);
jest.mock("./addTask", () => jest.fn(() => <div>AddTask Component</div>));

//Test Data Setup
const mockTask = {
  id: 1,
  title: "Test Task",
  description: "Test Description",
  assignTo: "user@example.com",
  position: "0",
};

const defaultProps = {
  task: mockTask,
  columnId: 1,
  boardOwnerId: 1,
  moveTask: jest.fn(),
};

//Basic rendering test
describe("Task Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useMutation as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isLoading: false,
    });
  });
  it("renders task information correctly", () => {
    render(<Task {...defaultProps} />);

    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
    expect(screen.getByText("U")).toBeInTheDocument(); // First letter of assignTo
  });

  // has Drag and drop functionality
  it("has drag and drop functionality", () => {
    render(<Task {...defaultProps} />);

    expect(useDrag).toHaveBeenCalledWith({
      type: "TASK",
      item: { task: mockTask, columnId: 1 },
      collect: expect.any(Function),
    });
  });

  //drag and drop behaviour
  it("has drag and drop functionality", () => {
    render(<Task {...defaultProps} />);

    expect(useDrag).toHaveBeenCalledWith({
      type: "TASK",
      item: { task: mockTask, columnId: 1 },
      collect: expect.any(Function),
    });
  });

  //edit functionality
  // it("opens edit modal when edit button is clicked", () => {
  //   render(<Task {...defaultProps} />);

  //   fireEvent.click(screen.getByTestId("edit-button"));

  //   expect(screen.getByText("AddTask Component")).toBeInTheDocument();
  // });

  // it("calls edit mutation when task is edited", async () => {
  //   const mockMutate = jest.fn();
  //   (useMutation as jest.Mock).mockReturnValueOnce({
  //     mutate: mockMutate,
  //     isLoading: false,
  //   });

  //   render(<Task {...defaultProps} />);
  //   fireEvent.click(screen.getByTestId("edit-button"));

  //   // Simulate edit submission
  //   const editData = {
  //     title: "Updated Task",
  //     description: "Updated Description",
  //     assignTo: "newuser@example.com",
  //   };

  //   // This would actually come from your AddTask component's submission
  //   fireEvent.submit(screen.getByText("AddTask Component"), {
  //     target: {
  //       title: { value: editData.title },
  //       description: { value: editData.description },
  //       assignTo: { value: editData.assignTo },
  //     },
  //   });

  //   await waitFor(() => {
  //     expect(mockMutate).toHaveBeenCalledWith(editData);
  //   });
  // });

  // //delete Functionality
  // it("opens delete confirmation dialog when delete button is clicked", () => {
  //   render(<Task {...defaultProps} />);

  //   fireEvent.click(screen.getByTestId("delete-button"));

  //   expect(screen.getByText("Dialog Content")).toBeInTheDocument();
  // });

  // it("calls delete mutation when deletion is confirmed", async () => {
  //   const mockMutate = jest.fn();
  //   (useMutation as jest.Mock).mockReturnValueOnce({
  //     mutate: mockMutate,
  //     isLoading: false,
  //   });

  //   render(<Task {...defaultProps} />);
  //   fireEvent.click(screen.getByTestId("delete-button"));

  //   // Simulate dialog confirmation
  //   fireEvent.click(screen.getByText("Dialog Content"));

  //   await waitFor(() => {
  //     expect(mockMutate).toHaveBeenCalledWith(1); // Task ID
  //     expect(toast.success).toHaveBeenCalledWith("Task deleted successfully");
  //   });
  // });
});
