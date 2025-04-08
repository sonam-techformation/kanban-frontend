import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useTheme } from "next-themes";
import { MdModeEditOutline } from "react-icons/md";
import { RiDeleteBin5Fill } from "react-icons/ri";
import Board from "./board";

// Mock next-themes
jest.mock("next-themes", () => ({
  useTheme: jest.fn(() => ({ theme: "light" })),
}));

// Mock react-icons
jest.mock("react-icons/md", () => ({
  MdModeEditOutline: jest.fn(() => <span>EditIcon</span>),
}));

jest.mock("react-icons/ri", () => ({
  RiDeleteBin5Fill: jest.fn(() => <span>DeleteIcon</span>),
}));

describe("Board Component", () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();
  const testProps = {
    name: "test board",
    boardId: 1,
    onEdit: mockOnEdit,
    onDelete: mockOnDelete,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders with default props", () => {
    render(<Board onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    expect(screen.getByText("Board")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/dashboard/list/undefined"
    );
    expect(screen.getByText("EditIcon")).toBeInTheDocument();
    expect(screen.getByText("DeleteIcon")).toBeInTheDocument();
  });

  it("renders with provided props", () => {
    render(<Board {...testProps} />);

    expect(screen.getByText("Test Board")).toBeInTheDocument(); // Note the capitalized text
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/dashboard/list/1"
    );
  });

  it("capitalizes the board name correctly", () => {
    render(<Board {...testProps} name="another test board" />);
    expect(screen.getByText("Another Test Board")).toBeInTheDocument();
  });

  it("calls onEdit when edit button is clicked", () => {
    render(<Board {...testProps} />);
    fireEvent.click(screen.getByText("EditIcon"));
    expect(mockOnEdit).toHaveBeenCalled();
  });

  it("calls onDelete when delete button is clicked", () => {
    render(<Board {...testProps} />);
    fireEvent.click(screen.getByText("DeleteIcon"));
    expect(mockOnDelete).toHaveBeenCalled();
  });

  it("applies light theme classes when theme is light", () => {
    (useTheme as jest.Mock).mockReturnValue({ theme: "light" });
    render(<Board {...testProps} />);

    const boardElement = screen.getByTestId("board-container"); // You might need to add data-testid to your component
    expect(boardElement).toHaveClass("p-4 w-xs md:w:sm"); // Update this to match your actual light theme classes
  });

  it("applies dark theme classes when theme is dark", () => {
    (useTheme as jest.Mock).mockReturnValue({ theme: "dark" });
    render(<Board {...testProps} />);

    const boardElement = screen.getByTestId("board-container"); // You might need to add data-testid to your component
    expect(boardElement).toHaveClass("p-4 w-xs md:w:sm"); // Update this to match your actual dark theme classes
  });

  it("renders with correct button classes", () => {
    render(<Board {...testProps} />);

    const editButton = screen.getByText("EditIcon").closest("button");
    const deleteButton = screen.getByText("DeleteIcon").closest("button");

    expect(editButton).toHaveClass("bg-indigo-600");
    expect(editButton).toHaveClass("hover:bg-indigo-700");
    expect(deleteButton).toHaveClass("bg-red-700");
    expect(deleteButton).toHaveClass("hover:bg-red-800");
  });

  it("matches snapshot", () => {
    const { asFragment } = render(<Board {...testProps} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
