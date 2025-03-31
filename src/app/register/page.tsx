"use client";
import React, { useEffect, useState } from "react";
import { FieldError, useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signup } from "../api/authApi";
import { useAuth } from "@/context/authContext";
import Button from "../components/button";
import InputController from "../components/inputController";
export default function Register() {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    control,
  } = useForm();
  const router = useRouter();
  const { token, login } = useAuth();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (token) router.push("/dashboard");
  }, [token, router]);
  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setErrorMessage(null); // Clear previous errors
    try {
      let register = {
        firstname: data.firstname,
        email: data.email,
        password: data.password,
      };
      const response = await signup(register);
      if (response && response.data.status === "success") {
        login(
          response.data.token,
          response.data.response.firstname,
          response.data.response.role,
          response.data.response.id
        );
      }
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.response.error ||
          "Signup failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          Register User
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          {errorMessage && (
            <p className="text-red-400 text-xs">{errorMessage}</p>
          )}

          <div className="mb-4">
            <InputController
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              id="name"
              name="firstname"
              label="Name"
              control={control}
              type="text"
              placeholder="Enter name"
              required={true}
              rules={{
                required: "Name is required",
              }}
              error={errors.firstname as FieldError}
            ></InputController>
          </div>

          <div className="mb-4">
            <InputController
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              id="email"
              name="email"
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

          <div className="mb-4">
            <InputController
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              id="confirmPassword"
              name="cpassword"
              label="Confirm Password"
              control={control}
              type="password"
              placeholder="Enter password"
              required={true}
              rules={{
                required: "Confirm Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
                validate: (data: string) => {
                  const password = getValues("password");
                  if (password === data) {
                    return true;
                  } else {
                    return "password and confirm password should be same";
                  }
                },
              }}
              error={errors.cpassword as FieldError}
            ></InputController>
          </div>

          <Button
            type="submit"
            text={isLoading ? "Loading..." : "Register"}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            isDisabled={isLoading}
          />
        </form>
        <p className="mt-4 text-sm text-gray-600 text-center">
          Already have an account? <Link href="/">Login</Link>
        </p>
      </div>
    </div>
  );
}
