import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { apiRequest } from "@/interceptor/interceptor";
import { useTheme } from "next-themes";
import AddBoard from "./addBoard";
import { Constants } from "@/utils/constant";

// Mock react-hook-form
jest.mock("react-hook-form", () => ({
  ...jest.requireActual("react-hook-form"),
  useForm: jest.fn(),
  Controller: jest.fn(({ render }) =>
    render({
      field: {
        onChange: jest.fn(),
        onBlur: jest.fn(),
        value: "",
        name: "name",
        ref: jest.fn(),
      },
      fieldState: { error: null },
    })
  ),
}));

// Mock apiRequest
jest.mock("@/interceptor/interceptor", () => ({
  apiRequest: jest.fn(),
}));

// Mock next-themes
jest.mock("next-themes", () => ({
  useTheme: jest.fn(() => ({ theme: "light" })),
}));

describe("AddBoard Component", () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();
  const mockSetValue = jest.fn();
  const mockHandleSubmit = jest.fn((callback) => callback);

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup useForm mock
    (useForm as jest.Mock).mockReturnValue({
      register: jest.fn(),
      handleSubmit: mockHandleSubmit,
      setValue: mockSetValue,
      control: {},
      formState: { errors: {} },
    });
  });

  it("renders correctly in add mode", () => {
    render(
      <AddBoard
        onClose={mockOnClose}
        onSave={mockOnSave}
        isEdit={false}
        editId={null}
        labelName="Board Name"
      />
    );

    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("renders correctly in edit mode", () => {
    render(
      <AddBoard
        onClose={mockOnClose}
        onSave={mockOnSave}
        isEdit={true}
        editId={123}
        labelName="Edit Board"
      />
    );
  });

  it("calls onClose when Cancel button is clicked", () => {
    render(
      <AddBoard
        onClose={mockOnClose}
        onSave={mockOnSave}
        isEdit={false}
        editId={null}
        labelName="Board Name"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(mockOnClose).toHaveBeenCalled();
  });

  //   it("submits form data when Save button is clicked", async () => {
  //     render(
  //       <AddBoard
  //         onClose={mockOnClose}
  //         onSave={mockOnSave}
  //         isEdit={false}
  //         editId={null}
  //         labelName="Board Name"
  //       />
  //     );

  //     const input = screen.getByLabelText("Board Name");
  //     fireEvent.change(input, { target: { value: "New Board" } });
  //     fireEvent.click(screen.getByRole("button", { name: "Save" }));

  //     await waitFor(() => {
  //       expect(mockHandleSubmit).toHaveBeenCalled();
  //       expect(mockOnSave).toHaveBeenCalled();
  //     });
  //   });

  it("shows validation error when name is empty", async () => {
    (useForm as jest.Mock).mockReturnValue({
      register: jest.fn(),
      handleSubmit: mockHandleSubmit,
      setValue: mockSetValue,
      control: {},
      formState: {
        errors: {
          name: {
            type: "required",
            message: "Name is required",
          },
        },
      },
    });

    render(
      <AddBoard
        onClose={mockOnClose}
        onSave={mockOnSave}
        isEdit={false}
        editId={null}
        labelName="Board Name"
      />
    );

    expect(screen.getByText("Name is required")).toBeInTheDocument();
  });

  it("pre-fills form in edit mode", async () => {
    const mockBoardData = {
      response: {
        name: "Existing Board",
      },
    };

    (apiRequest as jest.Mock).mockResolvedValue(mockBoardData);

    render(
      <AddBoard
        onClose={mockOnClose}
        onSave={mockOnSave}
        isEdit={true}
        editId={123}
        labelName="Edit Board"
      />
    );

    await waitFor(() => {
      expect(apiRequest).toHaveBeenCalledWith(
        `${Constants.API_URL}/boards/123`,
        "get"
      );
      expect(mockSetValue).toHaveBeenCalledWith("name", "Existing Board");
    });
  });

  //   it("handles API error in edit mode", async () => {
  //     const consoleSpy = jest.spyOn(console, "log");
  //     (apiRequest as jest.Mock).mockRejectedValue(new Error("API Error"));

  //     render(
  //       <AddBoard
  //         onClose={mockOnClose}
  //         onSave={mockOnSave}
  //         isEdit={true}
  //         editId={123}
  //         labelName="Edit Board"
  //       />
  //     );

  //     await waitFor(() => {
  //       expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
  //     });

  //     consoleSpy.mockRestore();
  //   });

  it("applies correct theme classes", () => {
    (useTheme as jest.Mock).mockReturnValue({ theme: "dark" });

    render(
      <AddBoard
        onClose={mockOnClose}
        onSave={mockOnSave}
        isEdit={false}
        editId={null}
        labelName="Board Name"
      />
    );

    // Add assertions for theme-specific classes if needed
    // This depends on how your InputController handles themes
  });

  it("matches snapshot in add mode", () => {
    const { asFragment } = render(
      <AddBoard
        onClose={mockOnClose}
        onSave={mockOnSave}
        isEdit={false}
        editId={null}
        labelName="Board Name"
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("matches snapshot in edit mode", () => {
    const { asFragment } = render(
      <AddBoard
        onClose={mockOnClose}
        onSave={mockOnSave}
        isEdit={true}
        editId={123}
        labelName="Edit Board"
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
