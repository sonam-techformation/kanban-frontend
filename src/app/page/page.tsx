"use client";
import Dashboard from "../dashboard/page";
import Login from "../login";
import Cookies from "js-cookie";

export default function Page() {
  const token = Cookies.get("token");
  return token ? <Dashboard /> : <Login />;
}
