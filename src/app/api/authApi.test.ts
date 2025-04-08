import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { Constants } from "@/utils/constant"; // adjust to your path
import { loginApi, signup } from "./authApi";

// Create a new mock instance of axios
const mock = new MockAdapter(axios);

describe("Auth API functions", () => {
  beforeEach(() => {
    // Reset mock adapter before each test
    mock.reset();
  });

  it("should login successfully", async () => {
    // Sample request data
    const loginData = { username: "test", password: "test123" };

    // Mock the POST request for login
    mock
      .onPost(`${Constants.API_URL}/login`)
      .reply(200, { message: "Login successful", token: "fake_token" });

    const response = await loginApi(loginData);

    // Assertions
    expect(response.status).toBe(200);
    expect(response.data.message).toBe("Login successful");
    expect(response.data.token).toBe("fake_token");
  });

  it("should fail login with incorrect credentials", async () => {
    // Sample request data
    const loginData = { username: "test", password: "wrongpassword" };

    // Mock the POST request for login
    mock
      .onPost(`${Constants.API_URL}/login`)
      .reply(401, { message: "Invalid credentials" });

    try {
      await loginApi(loginData);
    } catch (error: any) {
      expect(error.response.status).toBe(401);
      expect(error.response.data.message).toBe("Invalid credentials");
    }
  });

  it("should signup successfully", async () => {
    // Sample registration data
    const registerData = {
      username: "newuser",
      email: "newuser@example.com",
      password: "password123",
    };

    // Mock the POST request for signup
    mock
      .onPost(`${Constants.API_URL}/signup`)
      .reply(201, { message: "Signup successful", userId: 123 });

    const response = await signup(registerData);

    // Assertions
    expect(response.status).toBe(201);
    expect(response.data.message).toBe("Signup successful");
    expect(response.data.userId).toBe(123);
  });

  it("should fail signup with missing fields", async () => {
    // Sample registration data with missing fields
    const registerData = { username: "newuser" }; // missing email and password

    // Mock the POST request for signup
    mock
      .onPost(`${Constants.API_URL}/signup`)
      .reply(400, { message: "Missing required fields" });

    try {
      await signup(registerData);
    } catch (error: any) {
      expect(error.response.status).toBe(400);
      expect(error.response.data.message).toBe("Missing required fields");
    }
  });
});
