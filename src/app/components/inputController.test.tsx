// src/components/InputController/InputController.test.tsx
import React from "react";
import { render, screen, fireEvent, renderHook } from "@testing-library/react";
import { useForm } from "react-hook-form";
import "@testing-library/jest-dom";
import InputController from "./inputController";

// Helper component to wrap InputController with form context
const TestWrapper = ({ onSubmit = jest.fn() }) => {
  const { control, handleSubmit } = useForm({
    defaultValues: { testName: "" },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <InputController
        name="testName"
        control={control}
        label="Test Label"
        id="test-id"
        placeholder="Test placeholder"
      />
      <button type="submit">Submit</button>
    </form>
  );
};

describe("InputController - Form Integration", () => {
  it("integrates with react-hook-form correctly", async () => {
    const mockSubmit = jest.fn();
    render(<TestWrapper onSubmit={mockSubmit} />);

    const input = screen.getByPlaceholderText("Test placeholder");
    const submitButton = screen.getByText("Submit");

    // Test value change
    fireEvent.change(input, { target: { value: "new value" } });
    expect(input).toHaveValue("new value");

    // Test form submission
    fireEvent.click(submitButton);

    // Wait for form submission to complete
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(mockSubmit).toHaveBeenCalledWith(
      { testName: "new value" },
      expect.anything()
    );
  });
});

describe("InputController - Form Integration", () => {
  it("integrates with react-hook-form correctly", async () => {
    const mockSubmit = jest.fn();
    render(<TestWrapper onSubmit={mockSubmit} />);

    const input = screen.getByPlaceholderText("Test placeholder");
    const submitButton = screen.getByText("Submit");

    // Test value change
    fireEvent.change(input, { target: { value: "new value" } });
    expect(input).toHaveValue("new value");

    // Test form submission
    fireEvent.click(submitButton);

    // Wait for form submission to complete
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(mockSubmit).toHaveBeenCalledWith(
      { testName: "new value" },
      expect.anything()
    );
  });
});

// describe("InputController - Validation", () => {
//   it("shows error message when validation fails", () => {
//     const mockControl = {
//       register: jest.fn(),
//       formState: {
//         errors: {
//           testName: {
//             message: "This field is required",
//           },
//         },
//       },
//     } as unknown as Control<FieldValues>;

//     render(
//       <InputController
//         name="testName"
//         control={mockControl}
//         label="Test Label"
//         required={true}
//         error={
//           mockControl?.formState?.errors.testName as FieldError | undefined
//         }
//       />
//     );

//     // Verify error styling and message
//     const input = screen.getByLabelText("Test Label");
//     expect(input).toHaveClass("border-red-500");
//     expect(screen.getByText("This field is required")).toBeInTheDocument();
//   });
// });

describe("InputController - Disabled State", () => {
  it("renders as disabled when disabled prop is true", () => {
    const { result } = renderHook(() => useForm());

    render(
      <InputController
        name="testName"
        control={result.current.control}
        disabled={true}
      />
    );

    expect(screen.getByRole("textbox")).toBeDisabled();
  });
});

// describe("InputController - Custom Rules", () => {
//   it("applies custom validation rules", async () => {
//     const mockSubmit = jest.fn();
//     const { container } = render(<TestWrapper onSubmit={mockSubmit} />);

//     // Get the Controller instance (this requires some implementation knowledge)
//     const controller = (
//       container.querySelector("input") as unknown as Element & {
//         __reactProps$: any;
//       }
//     )?.__reactProps$?.controller;
//     expect(controller?.props.rules).toEqual({
//       required: "Test Label is required",
//     });
//   });
// });
