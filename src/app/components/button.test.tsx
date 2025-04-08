import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Button from "./button";
import { FiAlertCircle } from "react-icons/fi"; // Example icon (install react-icons if needed)

describe("Button Component", () => {
  // Basic rendering tests
  it("renders button with default props", () => {
    render(<Button />);
    const button = screen.getByRole("button");

    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveClass("bg-gray-500");
    expect(button).not.toBeDisabled();
  });

  it("renders button with text", () => {
    const buttonText = "Click Me";
    render(<Button text={buttonText} />);

    expect(screen.getByText(buttonText)).toBeInTheDocument();
  });

  it("renders button with icon", () => {
    render(<Button icon={<FiAlertCircle data-testid="icon" />} />);

    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("renders button with both text and icon", () => {
    const buttonText = "Save";
    render(
      <Button text={buttonText} icon={<FiAlertCircle data-testid="icon" />} />
    );

    expect(screen.getByText(buttonText)).toBeInTheDocument();
    expect(screen.getByTestId("icon")).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveTextContent(buttonText);
  });

  // Button types tests
  it("renders submit button when type is submit", () => {
    render(<Button type="submit" />);

    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("renders reset button when type is reset", () => {
    render(<Button type="reset" />);

    expect(screen.getByRole("button")).toHaveAttribute("type", "reset");
  });

  // Interaction tests
  it("calls onClick handler when clicked", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick} />);

    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when disabled", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick} isDisabled={true} />);

    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).not.toHaveBeenCalled();
  });

  // Style and state tests
  it("applies custom className", () => {
    const customClass = "custom-class";
    render(<Button className={customClass} />);

    expect(screen.getByRole("button")).toHaveClass(customClass);
  });

  it("renders disabled button when isDisabled is true", () => {
    render(<Button isDisabled={true} />);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("disabled");
  });

  // Accessibility tests
  it("has proper accessibility attributes when disabled", () => {
    render(<Button isDisabled={true} text="Disabled Button" />);

    const button = screen.getByRole("button", { name: "Disabled Button" });
    expect(button).toBeDisabled();
  });

  // Snapshot test
  it("matches snapshot with all props", () => {
    const { asFragment } = render(
      <Button
        type="submit"
        text="Submit"
        icon={<FiAlertCircle />}
        className="custom-class"
        isDisabled={false}
      />
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
