import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useTheme } from "next-themes";
import { MdClose } from "react-icons/md";
import Modal from "./modal";

// Mock next-themes
jest.mock("next-themes", () => ({
  useTheme: jest.fn(() => ({ theme: "light" })),
}));

// Mock react-icons
jest.mock("react-icons/md", () => ({
  MdClose: jest.fn(() => <span>CloseIcon</span>),
}));

describe("Modal Component", () => {
  const mockOnClose = jest.fn();
  const testProps = {
    modalTitle: "Test Modal",
    isOpen: true,
    onClose: mockOnClose,
    children: <div>Modal Content</div>,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    document.body.style.overflow = ""; // Reset body overflow
  });

  it("does not render when isOpen is false", () => {
    render(<Modal {...testProps} isOpen={false} />);
    expect(screen.queryByText("Test Modal")).not.toBeInTheDocument();
  });

  it("renders correctly when isOpen is true", () => {
    render(<Modal {...testProps} />);

    expect(screen.getByText("Test Modal")).toBeInTheDocument();
    expect(screen.getByText("Modal Content")).toBeInTheDocument();
    expect(screen.getByText("CloseIcon")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    render(<Modal {...testProps} />);
    fireEvent.click(screen.getByText("CloseIcon"));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("calls onClose when clicking outside modal", () => {
    render(<Modal {...testProps} />);

    // Click on the overlay background
    fireEvent.mouseDown(document.querySelector(".fixed.inset-0") as Element);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("does not call onClose when clicking inside modal", () => {
    render(<Modal {...testProps} />);

    // Click on the modal content
    fireEvent.mouseDown(screen.getByText("Modal Content"));
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it("applies correct styles for light theme", () => {
    (useTheme as jest.Mock).mockReturnValue({ theme: "light" });
    render(<Modal {...testProps} />);

    const modalContent = screen.getByText("Modal Content").parentElement;
    expect(modalContent).toHaveClass(
      "bg-gray-100 rounded-lg p-6 w-full max-w-md"
    );
  });

  it("applies correct styles for dark theme", () => {
    (useTheme as jest.Mock).mockReturnValue({ theme: "dark" });
    render(<Modal {...testProps} />);

    const modalContent = screen.getByText("Modal Content").parentElement;
    expect(modalContent).toHaveClass(
      "bg-gray-900 rounded-lg p-6 w-full max-w-md"
    );
  });

  it("disables body scroll when open", () => {
    render(<Modal {...testProps} />);
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("re-enables body scroll when closed", () => {
    const { rerender } = render(<Modal {...testProps} />);
    rerender(<Modal {...testProps} isOpen={false} />);
    expect(document.body.style.overflow).toBe("auto");
  });

  it("cleans up event listeners on unmount", () => {
    const addListenerSpy = jest.spyOn(document, "addEventListener");
    const removeListenerSpy = jest.spyOn(document, "removeEventListener");

    const { unmount } = render(<Modal {...testProps} />);
    unmount();

    expect(removeListenerSpy).toHaveBeenCalledWith(
      "mousedown",
      expect.any(Function)
    );
    expect(document.body.style.overflow).toBe("auto");

    addListenerSpy.mockRestore();
    removeListenerSpy.mockRestore();
  });

  it("matches snapshot when open", () => {
    const { asFragment } = render(<Modal {...testProps} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("matches snapshot when closed", () => {
    const { asFragment } = render(<Modal {...testProps} isOpen={false} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
