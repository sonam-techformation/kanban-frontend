import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useTheme } from "next-themes";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import Button from "./button";
import { Pagination } from "./pagination";

// Mock dependencies
jest.mock("next-themes", () => ({
  useTheme: jest.fn(() => ({
    theme: "light",
  })),
}));

jest.mock("./button", () => {
  return jest.fn(({ text, onClick, isDisabled, className, icon }) => (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={className}
      data-testid={
        text
          ? `page-button-${text}`
          : icon?.type === MdChevronLeft
          ? "prev-button"
          : "next-button"
      }
    >
      {text || icon}
    </button>
  ));
});

jest.mock("react-icons/md", () => ({
  MdChevronLeft: jest.fn(() => <span>Previous</span>),
  MdChevronRight: jest.fn(() => <span>Next</span>),
}));

describe("Pagination Component", () => {
  const mockPageChange = jest.fn();
  const defaultProps = {
    totalItems: 100,
    limit: 10,
    currentPage: 1,
    totalPages: 10,
    onPageChange: mockPageChange,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly with default props", () => {
    render(<Pagination {...defaultProps} />);

    // Verify the container renders
    expect(screen.getByTestId("pagination-root")).toBeInTheDocument();

    // Verify the info text
    const infoElement = screen.getByTestId("pagination-info");
    expect(infoElement).toHaveTextContent("Showing");
    expect(infoElement).toHaveTextContent("1");
    expect(infoElement).toHaveTextContent("to");
    expect(infoElement).toHaveTextContent("10");
    expect(infoElement).toHaveTextContent("of");
    expect(infoElement).toHaveTextContent("100");
    expect(infoElement).toHaveTextContent("results");

    // Verify buttons
    expect(screen.getByTestId("prev-button")).toBeDisabled();
    expect(screen.getByTestId("next-button")).not.toBeDisabled();
    expect(screen.getAllByTestId(/page-button-\d+/)).toHaveLength(5);
  });

  it("disables previous button on first page", () => {
    render(<Pagination {...defaultProps} currentPage={1} />);
    expect(screen.getByTestId("prev-button")).toBeDisabled();
  });

  it("disables next button on last page", () => {
    render(<Pagination {...defaultProps} currentPage={10} />);
    expect(screen.getByTestId("next-button")).toBeDisabled();
  });

  it("calls onPageChange with correct page number when a page button is clicked", () => {
    render(<Pagination {...defaultProps} />);
    fireEvent.click(screen.getByTestId("page-button-3"));
    expect(mockPageChange).toHaveBeenCalledWith(3);
  });

  it("calls onPageChange with previous page when previous button is clicked", () => {
    render(<Pagination {...defaultProps} currentPage={2} />);
    fireEvent.click(screen.getByTestId("prev-button"));
    expect(mockPageChange).toHaveBeenCalledWith(1);
  });

  it("calls onPageChange with next page when next button is clicked", () => {
    render(<Pagination {...defaultProps} />);
    fireEvent.click(screen.getByTestId("next-button"));
    expect(mockPageChange).toHaveBeenCalledWith(2);
  });

  it("shows correct range of page numbers when current page is in the middle", () => {
    render(<Pagination {...defaultProps} currentPage={5} />);
    const pageButtons = screen.getAllByTestId(/page-button-\d+/);
    const pageNumbers = pageButtons.map((button) => button.textContent);
    expect(pageNumbers).toEqual(["3", "4", "5", "6", "7"]);
  });

  it("shows first pages when current page is near start", () => {
    render(<Pagination {...defaultProps} currentPage={2} />);
    const pageButtons = screen.getAllByTestId(/page-button-\d+/);
    const pageNumbers = pageButtons.map((button) => button.textContent);
    expect(pageNumbers).toEqual(["1", "2", "3", "4", "5"]);
  });

  it("shows last pages when current page is near end", () => {
    render(<Pagination {...defaultProps} currentPage={9} />);
    const pageButtons = screen.getAllByTestId(/page-button-\d+/);
    const pageNumbers = pageButtons.map((button) => button.textContent);
    expect(pageNumbers).toEqual(["6", "7", "8", "9", "10"]);
  });

  it("shows all pages when total pages is less than max visible pages", () => {
    render(
      <Pagination {...defaultProps} totalItems={30} limit={10} totalPages={3} />
    );
    const pageButtons = screen.getAllByTestId(/page-button-\d+/);
    expect(pageButtons).toHaveLength(3);
  });

  it("displays correct item range", () => {
    render(<Pagination {...defaultProps} currentPage={3} />);

    // Verify the container exists
    const infoElement = screen.getByTestId("pagination-info");
    expect(infoElement).toBeInTheDocument();

    // Verify the complete text pattern
    expect(infoElement.textContent).toMatch(
      /Showing\s*21\s*to\s*30\s*of\s*100\s*results/
    );

    // Verify the number values are correctly rendered in spans
    expect(screen.getByText("21")).toHaveClass("font-medium");
    expect(screen.getByText("30")).toHaveClass("font-medium");
    expect(screen.getByText("100")).toHaveClass("font-medium");
  });

  it("applies active styles to current page button", () => {
    render(<Pagination {...defaultProps} currentPage={3} />);
    const activeButton = screen.getByTestId("page-button-3");
    expect(activeButton).toHaveClass("bg-indigo-600");
    expect(activeButton).toHaveClass("text-white");
  });

  it("renders with dark theme styles when theme is dark", () => {
    (useTheme as jest.Mock).mockReturnValueOnce({
      theme: "dark",
    });

    const { container } = render(<Pagination {...defaultProps} />);
    expect(container.firstChild).toHaveClass("bg-gray-800"); // Assuming secondaryBgColor returns this for dark theme
  });
});
