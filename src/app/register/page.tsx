"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signup } from "../api/authApi";
export default function Register() {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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
        router.push("/dashboard");
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
            <label
              htmlFor="name"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Name
            </label>
            <input
              type="text"
              placeholder="Enter name"
              id="name"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              {...register("firstname", { required: "Name is required" })}
            />
            {errors.firstname && (
              <p className="text-red-400 text-xs">
                {errors?.firstname!.message as string}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Email
            </label>
            <input
              type="email"
              placeholder="Enter email"
              id="email"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-400 text-xs">
                {errors?.email!.message as string}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              placeholder="Enter password"
              id="password"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && (
              <p className="text-red-400 text-xs">
                {errors?.password!.message as string}
              </p>
            )}
          </div>
          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Enter confirm password"
              id="confirmPassword"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              {...register("cpassword", {
                required: "Confirm Password is required",
                validate: (data: string) => {
                  const password = getValues("password");
                  if (password === data) {
                    return true;
                  } else {
                    return "password and confirm password should be same";
                  }
                },
              })}
            />
            {errors.cpassword && (
              <p className="text-red-400 text-xs">
                {errors.cpassword.message as string}
              </p>
            )}
          </div>
          <button
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Register"}
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600 text-center">
          Already have an account? <Link href="/">Login</Link>
        </p>
      </div>
    </div>
  );
}
