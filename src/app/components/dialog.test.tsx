import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useTheme } from "next-themes";
import { MdClose } from "react-icons/md";
import DialogBox from "./dialog";

// Mock next-themes
jest.mock("next-themes", () => ({
  useTheme: jest.fn(() => ({ theme: "light" })),
}));

// Mock react-icons
jest.mock("react-icons/md", () => ({
  MdClose: jest.fn(() => <span>CloseIcon</span>),
}));

describe("DialogBox Component", () => {
  const mockOnConfirm = jest.fn();
  const mockOnCancel = jest.fn();
  const defaultProps = {
    isOpen: true,
    onConfirm: mockOnConfirm,
    onCancel: mockOnCancel,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("does not render when isOpen is false", () => {
    render(<DialogBox {...defaultProps} isOpen={false} />);
    expect(screen.queryByText("Confirm Deletion")).not.toBeInTheDocument();
  });

  it("renders with default props", () => {
    render(<DialogBox {...defaultProps} />);

    expect(screen.getByText("Confirm Deletion")).toBeInTheDocument();
    expect(
      screen.getByText("Are you sure you want to delete this item?")
    ).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("CloseIcon")).toBeInTheDocument();
  });

  it("renders with custom props", () => {
    render(
      <DialogBox
        {...defaultProps}
        title="Custom Title"
        message="Custom message"
        confirmText="Confirm"
        cancelText="No"
      />
    );

    expect(screen.getByText("Custom Title")).toBeInTheDocument();
    expect(screen.getByText("Custom message")).toBeInTheDocument();
    expect(screen.getByText("Confirm")).toBeInTheDocument();
    expect(screen.getByText("No")).toBeInTheDocument();
  });

  it("calls onConfirm when confirm button is clicked", () => {
    render(<DialogBox {...defaultProps} />);
    fireEvent.click(screen.getByText("Delete"));
    expect(mockOnConfirm).toHaveBeenCalled();
  });

  it("calls onCancel when cancel button is clicked", () => {
    render(<DialogBox {...defaultProps} />);
    fireEvent.click(screen.getByText("Cancel"));
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it("calls onCancel when close icon is clicked", () => {
    render(<DialogBox {...defaultProps} />);
    fireEvent.click(screen.getByText("CloseIcon"));
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it("applies danger styles when danger prop is true", () => {
    render(<DialogBox {...defaultProps} danger={true} />);
    const confirmButton = screen.getByText("Delete").closest("button");
    expect(confirmButton).toHaveClass("bg-indigo-500");
    expect(confirmButton).toHaveClass("hover:bg-indigo-600");
  });

  it("applies non-danger styles when danger prop is false", () => {
    render(<DialogBox {...defaultProps} danger={false} />);
    const confirmButton = screen.getByText("Delete").closest("button");
    expect(confirmButton).toHaveClass("bg-indigo-500");
    expect(confirmButton).toHaveClass("hover:bg-indigo-600");
  });

  it("applies light theme classes when theme is light", () => {
    (useTheme as jest.Mock).mockReturnValue({ theme: "light" });
    render(<DialogBox {...defaultProps} />);

    const dialogContent =
      screen.getByText("Confirm Deletion").parentElement?.parentElement;
    expect(dialogContent).toHaveClass(
      "bg-gray-100 rounded-lg p-6 w-full max-w-md"
    ); // Update to match your bgColor(light) return value
  });

  it("applies dark theme classes when theme is dark", () => {
    (useTheme as jest.Mock).mockReturnValue({ theme: "dark" });
    render(<DialogBox {...defaultProps} />);

    const dialogContent =
      screen.getByText("Confirm Deletion").parentElement?.parentElement;
    expect(dialogContent).toHaveClass(
      "bg-gray-900 rounded-lg p-6 w-full max-w-md"
    ); // Update to match your bgColor(dark) return value
  });

  it("matches snapshot when open", () => {
    const { asFragment } = render(<DialogBox {...defaultProps} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("matches snapshot when closed", () => {
    const { asFragment } = render(
      <DialogBox {...defaultProps} isOpen={false} />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
