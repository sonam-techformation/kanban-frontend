"use client";
import React, { useEffect, useState } from "react";
import { FieldError, useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginApi } from "../api/authApi";
import { useSocket } from "@/context/socketContext";
import { useAuth } from "@/context/authContext";
import Button from "../components/button";
import InputController from "../components/inputController";
export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();
  const router = useRouter();
  const { token, login } = useAuth();

  useEffect(() => {
    if (token) {
      router.replace("/dashboard"); // Redirect if already logged in
    }
  }, [token, router]);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { registerUser } = useSocket();
  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setErrorMessage(null); // Clear previous errors
    try {
      let user: any;
      user = await loginApi(data);
      if (user && user.data.status === "success") {
        login(
          user.data.token,
          user.data.response.firstname,
          user.data.response.role,
          user.data.response.id
        );
        registerUser(user.data.response.id);
      }
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.response.error ||
          "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          Login
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          {errorMessage && (
            <p className="text-red-400 text-xs">{errorMessage}</p>
          )}

          <div className="mb-4">
            <InputController
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              name="email"
              id="email"
              label="Email"
              control={control}
              type="email"
              placeholder="Enter email"
              required={true}
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              }}
              error={errors.email as FieldError}
            ></InputController>
          </div>

          <div className="mb-4">
            <InputController
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              id="password"
              name="password"
              label="Password"
              control={control}
              type="password"
              placeholder="Enter password"
              required={true}
              rules={{
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              }}
              error={errors.password as FieldError}
            ></InputController>
          </div>

          <Button
            type="submit"
            text={isLoading ? "Loading..." : "Login"}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            isDisabled={isLoading}
          />
        </form>
        <p className="mt-4 text-sm text-gray-600 text-center">
          Don't have an account? <Link href="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
