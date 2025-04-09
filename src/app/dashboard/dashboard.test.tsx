import { render, screen } from "@testing-library/react";
import Dashboard from "./page";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import toast from "react-hot-toast";

// Mock data
const mockBoards = {
  data: [
    { id: 1, name: "Project X", user_id: 1 },
    { id: 2, name: "Marketing", user_id: 1 },
    { id: 3, name: "Development", user_id: 2 }, // Different user
  ],
  pagination: {
    page: 1,
    limit: 10,
    totalItems: 3,
    totalPages: 1,
  },
};

// Mock implementations
jest.mock("@tanstack/react-query");
jest.mock("next-themes");
jest.mock("next/navigation");
jest.mock("@/context/authContext");
jest.mock("react-hot-toast");

const mockQueryClient = {
  cancelQueries: jest.fn(),
  getQueryData: jest.fn(),
  setQueryData: jest.fn(),
  invalidateQueries: jest.fn(),
};

beforeEach(() => {
  (useQuery as jest.Mock).mockReturnValue({
    data: mockBoards,
    error: null,
    isLoading: false,
    isError: false,
  });

  (useMutation as jest.Mock).mockImplementation((config) => ({
    mutationFn: jest.fn().mockImplementation(config.mutationFn),
    mutate: jest.fn(),
    mutateAsync: jest.fn(),
  }));

  (useQueryClient as jest.Mock).mockReturnValue(mockQueryClient);

  (useAuth as jest.Mock).mockReturnValue({
    token: "mock-token",
    user: { id: 1, role: "user" },
  });

  (useRouter as jest.Mock).mockReturnValue({
    push: jest.fn(),
    replace: jest.fn(),
  });

  (useTheme as jest.Mock).mockReturnValue({
    theme: "light",
    setTheme: jest.fn(),
  });

  (toast.success as jest.Mock).mockImplementation(() => {});
  (toast.error as jest.Mock).mockImplementation(() => {});

  // Mock localStorage
  Storage.prototype.getItem = jest.fn((key) => {
    if (key === "role") return "user";
    if (key === "userId") return "1";
    return null;
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

//Basic Rebdering Test
describe("Dashboard Component - Basic Rendering", () => {
  it("should render the dashboard title", () => {
    render(<Dashboard />);
    expect(screen.getByText("Boards")).toBeInTheDocument();
  });

  it("should render the create board button", () => {
    render(<Dashboard />);
    expect(screen.getByText("Create Board")).toBeInTheDocument();
  });

  it("should render all boards with their names", () => {
    render(<Dashboard />);

    // Check that all board names are rendered
    expect(screen.getByText("Project X")).toBeInTheDocument();
    expect(screen.getByText("Marketing")).toBeInTheDocument();
    expect(screen.getByText("Development")).toBeInTheDocument();

    // Alternatively, if you want to be more specific about the Board component rendering:
    const boardElements = screen.getAllByTestId("board-container"); // Add data-testid to your Board component
    expect(boardElements.length).toBe(3);
  });
});
