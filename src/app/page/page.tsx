"use client";
import Dashboard from "../dashboard/page";
import Login from "../login";

export default function Page() {
  const token = localStorage.getItem("authToken");
  return token ? <Dashboard /> : <Login />;
}
