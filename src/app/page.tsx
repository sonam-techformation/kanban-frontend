"use client";
import dynamic from "next/dynamic";
import Cookies from "js-cookie";
import Dashboard from "./dashboard/page";
import Login from "./login/page";

export default function Home() {
  const token = Cookies.get("token");
  return token ? <Dashboard /> : <Login />;
}
