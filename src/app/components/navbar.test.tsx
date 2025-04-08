import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useTheme } from "next-themes";
import { useAuth } from "@/context/authContext";
import { useSocket } from "@/context/socketContext";
import Cookies from "js-cookie";
import { MdLogout } from "react-icons/md";
import Link from "next/link";
import Navbar from "./navbar";

// Mock dependencies
jest.mock("next-themes", () => ({
  useTheme: jest.fn(() => ({
    theme: "light",
    setTheme: jest.fn(),
  })),
}));

jest.mock("@/context/authContext", () => ({
  useAuth: jest.fn(() => ({
    logout: jest.fn(),
    userName: "test user",
  })),
}));

jest.mock("@/context/socketContext", () => ({
  useSocket: jest.fn(() => ({
    socket: {
      disconnect: jest.fn(),
    },
  })),
}));

jest.mock("js-cookie", () => ({
  remove: jest.fn(),
}));

jest.mock("react-icons/md", () => ({
  MdLogout: jest.fn(() => <span data-testid="logout-icon">LogoutIcon</span>),
}));

jest.mock("next/link", () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

jest.mock("./darkMode", () => {
  return {
    __esModule: true,
    default: jest.fn(() => (
      <div data-testid="dark-mode-toggle">DarkModeToggle</div>
    )),
  };
});

describe("Navbar Component", () => {
  const mockSetTheme = jest.fn();
  const mockLogout = jest.fn();
  const mockDisconnect = jest.fn();
  const mockRemoveCookie = jest.spyOn(Cookies, "remove");

  beforeEach(() => {
    jest.clearAllMocks();

    (useTheme as jest.Mock).mockReturnValue({
      theme: "light",
      setTheme: mockSetTheme,
    });

    (useAuth as jest.Mock).mockReturnValue({
      logout: mockLogout,
      userName: "test user",
    });

    (useSocket as jest.Mock).mockReturnValue({
      socket: {
        disconnect: mockDisconnect,
      },
    });

    Storage.prototype.getItem = jest.fn();
  });

  it("renders correctly with default props", () => {
    render(<Navbar />);

    expect(screen.getByText("Kanban Board")).toBeInTheDocument();
    expect(screen.getByText("Welcome Test User")).toBeInTheDocument();
    expect(screen.getByTestId("logout-icon")).toBeInTheDocument();
    expect(screen.getByTestId("dark-mode-toggle")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/dashboard");
  });

  it("displays username from localStorage when userName is not provided", () => {
    (useAuth as jest.Mock).mockReturnValue({
      logout: mockLogout,
      userName: null,
    });

    (Storage.prototype.getItem as jest.Mock).mockReturnValue("local user");

    render(<Navbar />);
    expect(screen.getByText("Welcome Local User")).toBeInTheDocument();
  });

  it("calls logout, socket.disconnect, and setTheme when logout is clicked", () => {
    render(<Navbar />);

    const logoutButton = screen.getByTestId("logout-icon");
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockDisconnect).toHaveBeenCalledTimes(1);
    expect(mockSetTheme).toHaveBeenCalledWith("light");
  });

  it("renders with dark theme styles when theme is dark", () => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: "dark",
      setTheme: mockSetTheme,
    });

    render(<Navbar />);
    const header = screen.getByRole("banner");

    // You might want to check for specific classes or styles here
    // This depends on how your navBgColor utility works
    expect(header).toHaveClass("shadow-md");
  });

  it("renders with light theme styles when theme is light", () => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: "light",
      setTheme: mockSetTheme,
    });

    render(<Navbar />);
    const header = screen.getByRole("banner");

    // Check for light theme specific classes
    expect(header).toHaveClass("shadow-md");
  });

  it("capitalizes the first letter of each word in username", () => {
    (useAuth as jest.Mock).mockReturnValue({
      logout: mockLogout,
      userName: "john doe",
    });

    render(<Navbar />);
    expect(screen.getByText("Welcome John Doe")).toBeInTheDocument();
  });

  it("handles empty username gracefully", () => {
    (useAuth as jest.Mock).mockReturnValue({
      logout: mockLogout,
      userName: "",
    });

    (Storage.prototype.getItem as jest.Mock).mockReturnValue(null);

    render(<Navbar />);
    expect(screen.getByText("Welcome")).toBeInTheDocument();
  });
});
