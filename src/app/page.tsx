"use client";
import Cookies from "js-cookie";
import Dashboard from "./dashboard/page";
import Login from "./login/page";
import DashboardLayout from "./dashboard/layout";

export default function Home() {
  const token = Cookies.get("token");
  return token ? (
    <DashboardLayout>
      <Dashboard />
    </DashboardLayout>
  ) : (
    <Login />
  );
}
