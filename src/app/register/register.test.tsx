import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { useForm, FieldError } from "react-hook-form";
import { useRouter } from "next/navigation";
import { signup } from "../api/authApi";
import { useAuth } from "@/context/authContext";
import Button from "../components/button";
import InputController from "../components/inputController";
import Register from "./page";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

// Mock necessary modules and contexts
jest.mock("next/navigation");
jest.mock("../api/authApi");
jest.mock("@/context/authContext");
jest.mock("../components/button");
jest.mock("../components/inputController");
jest.mock("react-hook-form");

describe("Register Component", () => {
  let mockRouter: ReturnType<typeof useRouter>;
  let mockAuth: ReturnType<typeof useAuth>;
  let mockUseForm: ReturnType<typeof useForm>;

  beforeEach(() => {
    // Reset mocks before each test
    mockRouter = {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      pathname: "/register",
      query: {},
      asPath: "/register",
    } as AppRouterInstance;
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    mockAuth = {
      token: null,
      login: jest.fn(),
      logout: jest.fn(),
      user: null,
    } as any;
    (useAuth as jest.Mock).mockReturnValue(mockAuth);

    mockUseForm = {
      register: jest.fn(() => ({
        onChange: jest.fn(),
        onBlur: jest.fn(),
        name: "",
      })),
      handleSubmit: jest.fn((callback) => callback),
      getValues: jest.fn(() => ({ password: "password123" })), // Default password for confirm password validation
      formState: { errors: {} },
      control: {},
      reset: jest.fn(),
      setValue: jest.fn(),
      trigger: jest.fn(),
      clearErrors: jest.fn(),
      setError: jest.fn(),
      watch: jest.fn(),
    } as any;
    (useForm as jest.Mock).mockReturnValue(mockUseForm);

    (Button as jest.Mock).mockImplementation(
      ({ text, type, onClick, isDisabled, className }) => (
        <button
          type={type}
          onClick={onClick}
          disabled={isDisabled}
          className={className}
        >
          {text}
        </button>
      )
    );

    (InputController as jest.Mock).mockImplementation(
      ({ label, name, control, type, placeholder, required, rules, error }) => (
        <div>
          <label htmlFor={name}>{label}</label>
          <input
            type={type}
            id={name}
            name={name}
            placeholder={placeholder}
            required={required}
            aria-invalid={!!error}
          />
          {error && <p data-testid={`${name}-error`}>{error.message}</p>}
        </div>
      )
    );
  });

  it("renders the register title", () => {
    render(<Register />);
    expect(screen.getByText("Register User")).toBeInTheDocument();
  });

  it("renders the name, email, password, and confirm password input fields", () => {
    render(<Register />);
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();
  });

  it("renders the register button", () => {
    render(<Register />);
    expect(
      screen.getByRole("button", { name: "Register" })
    ).toBeInTheDocument();
  });

  it("renders the link to the login page", () => {
    render(<Register />);
    expect(screen.getByText("Already have an account?")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Login" })).toHaveAttribute(
      "href",
      "/"
    );
  });

  it("redirects to /dashboard if token exists on mount", () => {
    mockAuth.token = "test-token";
    render(<Register />);
    expect(mockRouter.push).toHaveBeenCalledWith("/dashboard");
  });

  it("does not redirect if token does not exist on mount", () => {
    render(<Register />);
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  //   it("calls signup API and handles successful registration", async () => {
  //     const mockSignupApiResponse = {
  //       data: {
  //         status: "success",
  //         token: "new-token",
  //         response: { firstname: "Test", role: "user", id: "user-id" },
  //       },
  //     };
  //     (signup as jest.Mock).mockResolvedValue(mockSignupApiResponse);

  //     render(<Register />);
  //     const nameInput = screen.getByLabelText("Name") as HTMLInputElement;
  //     const emailInput = screen.getByLabelText("Email") as HTMLInputElement;
  //     const passwordInput = screen.getByLabelText("Password") as HTMLInputElement;
  //     const confirmPasswordInput = screen.getByLabelText(
  //       "Confirm Password"
  //     ) as HTMLInputElement;
  //     const registerButton = screen.getByRole("button", { name: "Register" });

  //     fireEvent.change(nameInput, { target: { value: "Test User" } });
  //     fireEvent.change(emailInput, { target: { value: "test@example.com" } });
  //     fireEvent.change(passwordInput, { target: { value: "password123" } });
  //     fireEvent.change(confirmPasswordInput, {
  //       target: { value: "password123" },
  //     });

  //     await act(async () => {
  //       fireEvent.click(registerButton);
  //       await waitFor(() => {
  //         expect(mockAuth.login).toHaveBeenCalledWith(
  //           "new-token",
  //           "Test",
  //           "user",
  //           "user-id"
  //         );
  //         expect(mockRouter.push).toHaveBeenCalledWith("/dashboard");
  //       });
  //     });

  //     expect(mockUseForm.handleSubmit).toHaveBeenCalled();
  //     expect(signup).toHaveBeenCalledWith({
  //       firstname: "Test User",
  //       email: "test@example.com",
  //       password: "password123",
  //     });
  //     expect(
  //       screen.queryByText("Signup failed. Please try again.")
  //     ).not.toBeInTheDocument();
  //   });

  //   it("calls signup API and handles registration failure with server error", async () => {
  //     const mockSignupApiError = {
  //       response: { data: { response: { error: "Email already exists" } } },
  //     };
  //     (signup as jest.Mock).mockRejectedValue(mockSignupApiError);

  //     render(<Register />);
  //     const nameInput = screen.getByLabelText("Name") as HTMLInputElement;
  //     const emailInput = screen.getByLabelText("Email") as HTMLInputElement;
  //     const passwordInput = screen.getByLabelText("Password") as HTMLInputElement;
  //     const confirmPasswordInput = screen.getByLabelText(
  //       "Confirm Password"
  //     ) as HTMLInputElement;
  //     const registerButton = screen.getByRole("button", { name: "Register" });

  //     fireEvent.change(nameInput, { target: { value: "Test User" } });
  //     fireEvent.change(emailInput, { target: { value: "test@example.com" } });
  //     fireEvent.change(passwordInput, { target: { value: "password123" } });
  //     fireEvent.change(confirmPasswordInput, {
  //       target: { value: "password123" },
  //     });

  //     await act(async () => {
  //       fireEvent.click(registerButton);
  //       await waitFor(() => {
  //         expect(screen.getByText("Email already exists")).toBeInTheDocument();
  //         expect(mockAuth.login).not.toHaveBeenCalled();
  //         expect(mockRouter.push).not.toHaveBeenCalled();
  //       });
  //     });

  //     expect(mockUseForm.handleSubmit).toHaveBeenCalled();
  //     expect(signup).toHaveBeenCalledWith({
  //       firstname: "Test User",
  //       email: "test@example.com",
  //       password: "password123",
  //     });
  //   });

  //   it("calls signup API and handles registration failure with generic error", async () => {
  //     (signup as jest.Mock).mockRejectedValue(new Error("Network error"));

  //     render(<Register />);
  //     const nameInput = screen.getByLabelText("Name") as HTMLInputElement;
  //     const emailInput = screen.getByLabelText("Email") as HTMLInputElement;
  //     const passwordInput = screen.getByLabelText("Password") as HTMLInputElement;
  //     const confirmPasswordInput = screen.getByLabelText(
  //       "Confirm Password"
  //     ) as HTMLInputElement;
  //     const registerButton = screen.getByRole("button", { name: "Register" });

  //     fireEvent.change(nameInput, { target: { value: "Test User" } });
  //     fireEvent.change(emailInput, { target: { value: "test@example.com" } });
  //     fireEvent.change(passwordInput, { target: { value: "password123" } });
  //     fireEvent.change(confirmPasswordInput, {
  //       target: { value: "password123" },
  //     });

  //     await act(async () => {
  //       fireEvent.click(registerButton);
  //       await waitFor(() => {
  //         expect(
  //           screen.getByText("Signup failed. Please try again.")
  //         ).toBeInTheDocument();
  //         expect(mockAuth.login).not.toHaveBeenCalled();
  //         expect(mockRouter.push).not.toHaveBeenCalled();
  //       });
  //     });

  //     expect(mockUseForm.handleSubmit).toHaveBeenCalled();
  //     expect(signup).toHaveBeenCalledWith({
  //       firstname: "Test User",
  //       email: "test@example.com",
  //       password: "password123",
  //     });
  //   });

  //   it("displays loading state while registering", async () => {
  //     const mockSignupApiPromise = new Promise(() => {});
  //     (signup as jest.Mock).mockReturnValue(mockSignupApiPromise);

  //     render(<Register />);
  //     const nameInput = screen.getByLabelText("Name") as HTMLInputElement;
  //     const emailInput = screen.getByLabelText("Email") as HTMLInputElement;
  //     const passwordInput = screen.getByLabelText("Password") as HTMLInputElement;
  //     const confirmPasswordInput = screen.getByLabelText(
  //       "Confirm Password"
  //     ) as HTMLInputElement;
  //     const registerButton = screen.getByRole("button", { name: "Register" });

  //     fireEvent.change(nameInput, { target: { value: "Test User" } });
  //     fireEvent.change(emailInput, { target: { value: "test@example.com" } });
  //     fireEvent.change(passwordInput, { target: { value: "password123" } });
  //     fireEvent.change(confirmPasswordInput, {
  //       target: { value: "password123" },
  //     });

  //     await act(() => {
  //       fireEvent.click(registerButton);
  //     });

  //     expect(
  //       screen.getByRole("button", { name: "Loading..." })
  //     ).toBeInTheDocument();

  //     // Clean up the pending promise
  //     (signup as jest.Mock).mockRejectedValue(new Error("Test cleanup"));
  //     await waitFor(
  //       () =>
  //         expect(screen.queryByRole("button", { name: "Loading..." })).toBeNull(),
  //       { timeout: 10 }
  //     );
  //   });

  it("displays name validation error", () => {
    mockUseForm.formState.errors = {
      firstname: {
        type: "required",
        message: "Name is required",
      } as FieldError,
    };
    render(<Register />);
    expect(screen.getByText("Name is required")).toBeInTheDocument();
  });

  it("displays email validation error", () => {
    mockUseForm.formState.errors = {
      email: { type: "required", message: "Email is required" } as FieldError,
    };
    render(<Register />);
    expect(screen.getByText("Email is required")).toBeInTheDocument();
  });

  it("displays invalid email format error", () => {
    mockUseForm.formState.errors = {
      email: {
        type: "pattern",
        message: "Invalid email address",
      } as FieldError,
    };
    render(<Register />);
    expect(screen.getByText("Invalid email address")).toBeInTheDocument();
  });

  it("displays password required error", () => {
    mockUseForm.formState.errors = {
      password: {
        type: "required",
        message: "Password is required",
      } as FieldError,
    };
    render(<Register />);
    expect(screen.getByText("Password is required")).toBeInTheDocument();
  });

  it("displays password min length error", () => {
    mockUseForm.formState.errors = {
      password: {
        type: "minLength",
        message: "Password must be at least 6 characters",
      } as FieldError,
    };
    render(<Register />);
    expect(
      screen.getByText("Password must be at least 6 characters")
    ).toBeInTheDocument();
  });

  it("displays confirm password required error", () => {
    mockUseForm.formState.errors = {
      cpassword: {
        type: "required",
        message: "Confirm Password is required",
      } as FieldError,
    };
    render(<Register />);
    expect(
      screen.getByText("Confirm Password is required")
    ).toBeInTheDocument();
  });

  it("displays confirm password min length error", () => {
    mockUseForm.formState.errors = {
      cpassword: {
        type: "minLength",
        message: "Password must be at least 6 characters",
      } as FieldError,
    };
    render(<Register />);
    expect(
      screen.getByText("Password must be at least 6 characters")
    ).toBeInTheDocument();
  });

  it("displays confirm password mismatch error", () => {
    mockUseForm.formState.errors = {
      cpassword: {
        type: "validate",
        message: "password and confirm password should be same",
      } as FieldError,
    };
    (mockUseForm.getValues as jest.Mock).mockReturnValue({
      password: "password123",
    });
    render(<Register />);
    expect(
      screen.getByText("password and confirm password should be same")
    ).toBeInTheDocument();
  });
});
