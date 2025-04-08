// import { render, screen } from "@testing-library/react";
// import Login from "./page";

// jest.mock("next/navigation", () => ({
//   useRouter: () => ({
//     push: jest.fn(),
//     replace: jest.fn(),
//     prefetch: jest.fn(),
//   }),
//   usePathname: () => "/login", // Mock pathname if needed
//   useSearchParams: () => new URLSearchParams(), // Mock search params
// }));

// jest.mock("../../context/authContext", () => {
//   return {
//     useAuth: () => ({
//       login: jest.fn(),
//       userName: "test user",
//     }),
//   };
// });

// describe("Login Component", () => {
//   it("should render heading correctly", () => {
//     render(<Login />);
//     expect(screen.getByTestId("login-title")).toBeInTheDocument();
//   });

//   it("should render login form correctly", () => {
//     render(<Login />);
//     expect(screen.queryByRole("button", { name: "Login" })).toBeInTheDocument();
//   });

//   it("should render already have an account correctly", () => {
//     render(<Login />);
//     expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
//   });

//   it("should link work correctly", () => {
//     render(<Login />);
//     expect(screen.getByRole("link")).toHaveAttribute("href", "/register");
//   });
// });

import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { useForm, FieldError } from "react-hook-form";
import { useRouter } from "next/navigation";
import { loginApi } from "../api/authApi";
import { useSocket } from "@/context/socketContext";
import { useAuth } from "@/context/authContext";
import Button from "../components/button";
import InputController from "../components/inputController";
import Login from "./page";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

// Mock necessary modules and contexts
jest.mock("next/navigation");
jest.mock("../api/authApi");
jest.mock("@/context/socketContext");
jest.mock("@/context/authContext");
jest.mock("../components/button");
jest.mock("../components/inputController");
jest.mock("react-hook-form");

describe("Login Component", () => {
  let mockRouter: ReturnType<typeof useRouter>;
  let mockAuth: ReturnType<typeof useAuth>;
  let mockSocket: ReturnType<typeof useSocket>;
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
      pathname: "/",
      query: {},
      asPath: "/",
    } as AppRouterInstance;
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    mockAuth = {
      token: null,
      login: jest.fn(),
      logout: jest.fn(),
      user: null,
    } as any;
    (useAuth as jest.Mock).mockReturnValue(mockAuth);

    mockSocket = {
      socket: { emit: jest.fn(), on: jest.fn(), off: jest.fn() } as any,
      registerUser: jest.fn(),
    } as any;
    (useSocket as jest.Mock).mockReturnValue(mockSocket);

    mockUseForm = {
      register: jest.fn(() => ({
        onChange: jest.fn(),
        onBlur: jest.fn(),
        name: "",
      })),
      handleSubmit: jest.fn((callback) => callback),
      formState: { errors: {} },
      control: {},
      reset: jest.fn(),
      setValue: jest.fn(),
      getValues: jest.fn(),
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

  it("renders the login title", () => {
    render(<Login />);
    expect(screen.getByTestId("login-title")).toBeInTheDocument();
  });

  it("renders the email and password input fields", () => {
    render(<Login />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  it("renders the login button", () => {
    render(<Login />);
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
  });

  it("renders the link to the register page", () => {
    render(<Login />);
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Register" })).toHaveAttribute(
      "href",
      "/register"
    );
  });

  it("redirects to /dashboard if token exists on mount", () => {
    mockAuth.token = "test-token";
    render(<Login />);
    expect(mockRouter.replace).toHaveBeenCalledWith("/dashboard");
  });

  it("does not redirect if token does not exist on mount", () => {
    render(<Login />);
    expect(mockRouter.replace).not.toHaveBeenCalled();
  });

  // it("calls loginApi and handles successful login", async () => {
  //   const mockLoginApiResponse = {
  //     data: {
  //       status: "success",
  //       token: "new-token",
  //       response: { firstname: "John", role: "user", id: "user-id" },
  //     },
  //   };
  //   (loginApi as jest.Mock).mockResolvedValue(mockLoginApiResponse);

  //   render(<Login />);
  //   const emailInput = screen.getByLabelText("Email") as HTMLInputElement;
  //   const passwordInput = screen.getByLabelText("Password") as HTMLInputElement;
  //   const loginButton = screen.getByRole("button", { name: "Login" });

  //   fireEvent.change(emailInput, { target: { value: "test@example.com" } });
  //   fireEvent.change(passwordInput, { target: { value: "password123" } });

  //   fireEvent.click(loginButton);
  //   await waitFor(() => {
  //     expect(mockAuth.login).toHaveBeenCalledWith(
  //       "new-token",
  //       "John",
  //       "user",
  //       "user-id"
  //     );
  //     expect(mockSocket.registerUser).toHaveBeenCalledWith("user-id");
  //     expect(mockRouter.replace).toHaveBeenCalledWith("/dashboard");
  //   });

  //   expect(mockUseForm.handleSubmit).toHaveBeenCalled();
  //   expect(loginApi).toHaveBeenCalledWith({
  //     email: "test@example.com",
  //     password: "password123",
  //   });
  //   expect(
  //     screen.queryByText("Login failed. Please try again.")
  //   ).not.toBeInTheDocument();
  // });

  // it("calls loginApi and handles login failure with server error", async () => {
  //   const mockLoginApiError = {
  //     response: { data: { response: { error: "Invalid credentials" } } },
  //   };
  //   (loginApi as jest.Mock).mockRejectedValue(mockLoginApiError);

  //   render(<Login />);
  //   const emailInput = screen.getByLabelText("Email") as HTMLInputElement;
  //   const passwordInput = screen.getByLabelText("Password") as HTMLInputElement;
  //   const loginButton = screen.getByRole("button", { name: "Login" });

  //   fireEvent.change(emailInput, { target: { value: "test@example.com" } });
  //   fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
  //   fireEvent.click(loginButton);

  //   expect(mockUseForm.handleSubmit).toHaveBeenCalled();
  //   expect(loginApi).toHaveBeenCalledWith({
  //     email: "test@example.com",
  //     password: "wrongpassword",
  //   });

  //   await waitFor(() => {
  //     expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
  //     expect(mockAuth.login).not.toHaveBeenCalled();
  //     expect(mockRouter.replace).not.toHaveBeenCalled();
  //   });
  // });

  // it("calls loginApi and handles login failure with generic error", async () => {
  //   (loginApi as jest.Mock).mockRejectedValue(new Error("Network error"));

  //   render(<Login />);
  //   const emailInput = screen.getByLabelText("Email") as HTMLInputElement;
  //   const passwordInput = screen.getByLabelText("Password") as HTMLInputElement;
  //   const loginButton = screen.getByRole("button", { name: "Login" });

  //   fireEvent.change(emailInput, { target: { value: "test@example.com" } });
  //   fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
  //   fireEvent.click(loginButton);

  //   expect(mockUseForm.handleSubmit).toHaveBeenCalled();
  //   expect(loginApi).toHaveBeenCalledWith({
  //     email: "test@example.com",
  //     password: "wrongpassword",
  //   });

  //   await waitFor(() => {
  //     expect(
  //       screen.getByText("Login failed. Please try again.")
  //     ).toBeInTheDocument();
  //     expect(mockAuth.login).not.toHaveBeenCalled();
  //     expect(mockRouter.replace).not.toHaveBeenCalled();
  //   });
  // });

  // it("displays loading state while logging in", async () => {
  //   // Simulate a pending promise for loginApi
  //   const mockLoginApiPromise = new Promise(() => {});
  //   (loginApi as jest.Mock).mockReturnValue(mockLoginApiPromise);

  //   render(<Login />);
  //   const emailInput = screen.getByLabelText("Email") as HTMLInputElement;
  //   const passwordInput = screen.getByLabelText("Password") as HTMLInputElement;
  //   const loginButton = screen.getByRole("button", { name: "Login" });

  //   fireEvent.change(emailInput, { target: { value: "test@example.com" } });
  //   fireEvent.change(passwordInput, { target: { value: "password123" } });
  //   fireEvent.click(loginButton);

  //   expect(
  //     screen.getByRole("button", { name: "Loading..." })
  //   ).toBeInTheDocument();

  //   // Clean up the pending promise to avoid test hanging
  //   (loginApi as jest.Mock).mockRejectedValue(new Error("Test cleanup"));
  //   await waitFor(
  //     () =>
  //       expect(screen.queryByRole("button", { name: "Loading..." })).toBeNull(),
  //     { timeout: 10 }
  //   );
  // });

  //------------------------------------------------------------Login Successful----------------------------------------------------------------------//

  // it("calls loginApi and handles successful login", async () => {
  //   const mockLoginApiResponse = {
  //     data: {
  //       status: "success",
  //       token: "new-token",
  //       response: { firstname: "John", role: "user", id: "user-id" },
  //     },
  //   };
  //   (loginApi as jest.Mock).mockResolvedValue(mockLoginApiResponse);

  //   render(<Login />);
  //   const emailInput = screen.getByLabelText("Email") as HTMLInputElement;
  //   const passwordInput = screen.getByLabelText("Password") as HTMLInputElement;
  //   const formElement = screen.getByTestId("login-form") as HTMLFormElement;

  //   fireEvent.change(emailInput, { target: { value: "test@example.com" } });
  //   fireEvent.change(passwordInput, { target: { value: "password123" } });

  //   // await act(async () => {
  //   fireEvent.submit(formElement); // Trigger the submit event directly
  //   await waitFor(() => {
  //     expect(mockAuth.login).toHaveBeenCalledWith(
  //       "new-token",
  //       "John",
  //       "user",
  //       "user-id"
  //     );
  //     expect(mockSocket.registerUser).toHaveBeenCalledWith("user-id");
  //     expect(mockRouter.replace).toHaveBeenCalledWith("/dashboard");
  //   });
  //   // });

  //   expect(mockUseForm.handleSubmit).toHaveBeenCalled();
  //   expect(loginApi).toHaveBeenCalledWith({
  //     email: "test@example.com",
  //     password: "password123",
  //   });
  //   expect(
  //     screen.queryByText("Login failed. Please try again.")
  //   ).not.toBeInTheDocument();
  // });

  it("displays email validation error", async () => {
    mockUseForm.formState.errors = {
      email: { type: "required", message: "Email is required" } as FieldError,
    };
    render(<Login />);
    expect(screen.getByText("Email is required")).toBeInTheDocument();
  });

  it("displays invalid email format error", async () => {
    mockUseForm.formState.errors = {
      email: {
        type: "pattern",
        message: "Invalid email address",
      } as FieldError,
    };
    render(<Login />);
    expect(screen.getByText("Invalid email address")).toBeInTheDocument();
  });

  it("displays password required error", async () => {
    mockUseForm.formState.errors = {
      password: {
        type: "required",
        message: "Password is required",
      } as FieldError,
    };
    render(<Login />);
    expect(screen.getByText("Password is required")).toBeInTheDocument();
  });

  it("displays password min length error", async () => {
    mockUseForm.formState.errors = {
      password: {
        type: "minLength",
        message: "Password must be at least 6 characters",
      } as FieldError,
    };
    render(<Login />);
    expect(
      screen.getByText("Password must be at least 6 characters")
    ).toBeInTheDocument();
  });
});
