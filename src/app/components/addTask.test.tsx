import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { useForm } from "react-hook-form";
import { getAllUser, getTaskDetailById } from "../api/taskAssignApi";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import AddTask from "./addTask";

// Mock dependencies
jest.mock("react-hook-form", () => ({
  ...jest.requireActual("react-hook-form"),
  useForm: jest.fn(),
  Controller: jest.fn(({ render }) =>
    render({
      field: {
        onChange: jest.fn(),
        onBlur: jest.fn(),
        value: "",
        name: "test-field",
        ref: jest.fn(),
      },
      fieldState: { error: null },
    })
  ),
}));

jest.mock("../api/taskAssignApi", () => ({
  getAllUser: jest.fn(),
  getTaskDetailById: jest.fn(),
}));

jest.mock("next-themes", () => ({
  useTheme: jest.fn(() => ({ theme: "light" })),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({ push: jest.fn() })),
}));

describe("AddTask Component", () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();
  const mockSetValue = jest.fn();
  const mockHandleSubmit = jest.fn((callback) => callback);
  const mockUsers = [
    { id: 1, firstname: "User 1" },
    { id: 2, firstname: "User 2" },
  ];
  const mockTaskDetails = {
    response: {
      title: "Test Task",
      description: "Test Description",
      assignTo: 1,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup useForm mock
    (useForm as jest.Mock).mockReturnValue({
      register: jest.fn(),
      handleSubmit: mockHandleSubmit,
      setValue: mockSetValue,
      watch: jest.fn(),
      control: {},
      formState: { errors: {} },
    });

    (getAllUser as jest.Mock).mockResolvedValue({ response: mockUsers });
  });

  it("renders correctly in add mode", async () => {
    render(
      <AddTask
        onClose={mockOnClose}
        onSave={mockOnSave}
        isEdit={false}
        editId={null}
        boardOwnerId={1}
      />
    );

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Cancel" })
      ).toBeInTheDocument();
    });
  });

  it("renders correctly in edit mode", async () => {
    (getTaskDetailById as jest.Mock).mockResolvedValue(mockTaskDetails);

    render(
      <AddTask
        onClose={mockOnClose}
        onSave={mockOnSave}
        isEdit={true}
        editId={123}
        boardOwnerId={1}
      />
    );

    await waitFor(() => {
      expect(getTaskDetailById).toHaveBeenCalledWith(123);
      expect(mockSetValue).toHaveBeenCalledWith("title", "Test Task");
      expect(mockSetValue).toHaveBeenCalledWith(
        "description",
        "Test Description"
      );
      expect(mockSetValue).toHaveBeenCalledWith("assignTo", 1);
    });
  });

  it("fetches users on mount", async () => {
    render(
      <AddTask
        onClose={mockOnClose}
        onSave={mockOnSave}
        isEdit={false}
        editId={null}
        boardOwnerId={1}
      />
    );

    await waitFor(() => {
      expect(getAllUser).toHaveBeenCalledWith(1);
    });
  });

  // it("handles form submission", async () => {
  //   render(
  //     <AddTask
  //       onClose={mockOnClose}
  //       onSave={mockOnSave}
  //       isEdit={false}
  //       editId={null}
  //       boardOwnerId={1}
  //     />
  //   );

  //   fireEvent.click(screen.getByRole("button", { name: "Save" }));

  //   await waitFor(() => {
  //     expect(mockHandleSubmit).toHaveBeenCalled();
  //     expect(mockOnSave).toHaveBeenCalled();
  //   });
  // });

  // it("calls onClose when Cancel is clicked", async () => {
  //   render(
  //     <AddTask
  //       onClose={mockOnClose}
  //       onSave={mockOnSave}
  //       isEdit={false}
  //       editId={null}
  //       boardOwnerId={1}
  //     />
  //   );

  //   fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
  //   expect(mockOnClose).toHaveBeenCalled();
  // });

  // it("shows validation errors", async () => {
  //   (useForm as jest.Mock).mockReturnValue({
  //     register: jest.fn(),
  //     handleSubmit: mockHandleSubmit,
  //     setValue: mockSetValue,
  //     watch: jest.fn(),
  //     control: {},
  //     formState: {
  //       errors: {
  //         title: { message: "Title is required" },
  //         description: { message: "Description is required" },
  //         assignTo: { message: "Assignment is required" },
  //       },
  //     },
  //   });

  //   render(
  //     <AddTask
  //       onClose={mockOnClose}
  //       onSave={mockOnSave}
  //       isEdit={false}
  //       editId={null}
  //       boardOwnerId={1}
  //     />
  //   );

  //   expect(screen.getByText("Title is required")).toBeInTheDocument();
  //   expect(screen.getByText("Description is required")).toBeInTheDocument();
  //   expect(screen.getByText("Assignment is required")).toBeInTheDocument();
  // });

  it("shows error message when user fetch fails", async () => {
    (getAllUser as jest.Mock).mockRejectedValue(
      new Error("Failed to fetch users")
    );

    await act(async () => {
      render(
        <AddTask
          onClose={mockOnClose}
          onSave={mockOnSave}
          isEdit={false}
          editId={null}
          boardOwnerId={1}
        />
      );
    });

    await waitFor(() => {
      expect(screen.getByText("Failed to fetch users")).toBeInTheDocument();
    });
  });

  it("shows error message when task details fetch fails", async () => {
    (getTaskDetailById as jest.Mock).mockRejectedValue(
      new Error("Failed to fetch task")
    );

    await act(async () => {
      render(
        <AddTask
          onClose={mockOnClose}
          onSave={mockOnSave}
          isEdit={true}
          editId={123}
          boardOwnerId={1}
        />
      );
    });

    await waitFor(() => {
      expect(screen.getByText("Failed to fetch task")).toBeInTheDocument();
    });
  });

  // it("matches snapshot in add mode", async () => {
  //   const { asFragment } = render(
  //     <AddTask
  //       onClose={mockOnClose}
  //       onSave={mockOnSave}
  //       isEdit={false}
  //       editId={null}
  //       boardOwnerId={1}
  //     />
  //   );

  //   await waitFor(() => {
  //     expect(asFragment()).toMatchSnapshot();
  //   });
  // });

  // it("matches snapshot in edit mode", async () => {
  //   (getTaskDetailById as jest.Mock).mockResolvedValue(mockTaskDetails);

  //   const { asFragment } = render(
  //     <AddTask
  //       onClose={mockOnClose}
  //       onSave={mockOnSave}
  //       isEdit={true}
  //       editId={123}
  //       boardOwnerId={1}
  //     />
  //   );

  //   await waitFor(() => {
  //     expect(asFragment()).toMatchSnapshot();
  //   });
  // });
});
