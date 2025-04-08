import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useTheme } from "next-themes";
import { Control, Controller, FieldError, FieldValues } from "react-hook-form";
import SelectController from "./selectController";

// Mock next-themes
jest.mock("next-themes", () => ({
  useTheme: jest.fn(() => ({ theme: "light" })),
}));

// Mock react-hook-form's Controller
jest.mock("react-hook-form", () => ({
  ...jest.requireActual("react-hook-form"),
  Controller: jest.fn(({ render }) =>
    render({
      field: {
        onChange: jest.fn(),
        onBlur: jest.fn(),
        value: "",
        name: "test-select",
        ref: jest.fn(),
      },
    })
  ),
}));

describe("SelectController", () => {
  const mockControl = {} as Control<FieldValues | any>;
  const mockOptions = [
    { id: 1, firstname: "Option 1" },
    { id: 2, firstname: "Option 2", disabled: true },
    { id: 3, firstname: "Option 3" },
  ];

  beforeEach(() => {
    (Controller as jest.Mock).mockImplementation(({ render }) =>
      render({
        field: {
          onChange: jest.fn(),
          onBlur: jest.fn(),
          value: "",
          name: "test-select",
          ref: jest.fn(),
        },
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    render(
      <SelectController
        name="test-select"
        control={mockControl}
        options={mockOptions}
      />
    );
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("displays the label when provided", () => {
    render(
      <SelectController
        name="test-select"
        control={mockControl}
        options={mockOptions}
        label="Test Label"
      />
    );
    expect(screen.getByText("Test Label")).toBeInTheDocument();
  });

  it("shows required asterisk when required is true", () => {
    render(
      <SelectController
        name="test-select"
        control={mockControl}
        options={mockOptions}
        label="Test Label"
        required
      />
    );
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("displays the placeholder text", () => {
    render(
      <SelectController
        name="test-select"
        control={mockControl}
        options={mockOptions}
        placeholder="Custom Placeholder"
      />
    );
    expect(screen.getByText("Custom Placeholder")).toBeInTheDocument();
  });

  it("renders all provided options", () => {
    render(
      <SelectController
        name="test-select"
        control={mockControl}
        options={mockOptions}
      />
    );
    expect(screen.getAllByRole("option").length).toBe(mockOptions.length + 1); // +1 for the placeholder option
  });

  it("disables the select when disabled prop is true", () => {
    render(
      <SelectController
        name="test-select"
        control={mockControl}
        options={mockOptions}
        disabled
      />
    );
    expect(screen.getByRole("combobox")).toBeDisabled();
  });

  it("shows error message when error is provided", () => {
    const errorMessage = "This field is required";
    render(
      <SelectController
        name="test-select"
        control={mockControl}
        options={mockOptions}
        error={{ message: errorMessage } as FieldError}
      />
    );
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toHaveClass("border-red-500");
  });

  it("applies custom className", () => {
    const customClass = "custom-class";
    render(
      <SelectController
        name="test-select"
        control={mockControl}
        options={mockOptions}
        className={customClass}
      />
    );
    expect(screen.getByRole("combobox")).toHaveClass(customClass);
  });

  it("uses the name as id when id is not provided", () => {
    render(
      <SelectController
        name="test-select"
        control={mockControl}
        options={mockOptions}
      />
    );
    expect(screen.getByRole("combobox")).toHaveAttribute("id", "test-select");
  });

  it("uses the provided id when available", () => {
    render(
      <SelectController
        name="test-select"
        control={mockControl}
        options={mockOptions}
        id="custom-id"
      />
    );
    expect(screen.getByRole("combobox")).toHaveAttribute("id", "custom-id");
  });

  // it("calls onChange when an option is selected", async () => {
  //   const mockOnChange = jest.fn();
  //   (Controller as jest.Mock).mockImplementation(({ render }) =>
  //     render({
  //       field: {
  //         onChange: mockOnChange,
  //         onBlur: jest.fn(),
  //         value: "",
  //         name: "test-select",
  //         ref: jest.fn(),
  //       },
  //     })
  //   );

  //   const mockOptions = [
  //     { id: 1, firstname: "Option 1" },
  //     { id: 2, firstname: "Option 2" },
  //     { id: 3, firstname: "Option 3" },
  //   ];

  //   render(
  //     <SelectController
  //       name="test-select"
  //       control={mockControl}
  //       options={mockOptions}
  //     />
  //   );

  //   const select = screen.getByRole("combobox");
  //   await userEvent.selectOptions(select, "Option 2");

  //   expect(mockOnChange).toHaveBeenCalledWith(2); // Verify it was called with the option's value
  // });

  it("renders with dark theme classes when theme is dark", () => {
    (useTheme as jest.Mock).mockReturnValue({ theme: "dark" });

    render(
      <SelectController
        name="test-select"
        control={mockControl}
        options={mockOptions}
      />
    );

    const options = screen.getAllByRole("option");
    options.forEach((option) => {
      expect(option).toHaveClass("bg-gray-900");
      expect(option).toHaveClass("text-gray-900}");
    });
  });

  it("renders disabled options correctly", () => {
    render(
      <SelectController
        name="test-select"
        control={mockControl}
        options={mockOptions}
      />
    );

    const disabledOption = screen.getByRole("option", {
      name: "Option 2",
    });
    expect(disabledOption).toBeDisabled();
  });
});
