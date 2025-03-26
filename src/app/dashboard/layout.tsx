"use client";
import Navbar from "../components/navbar";
import Cookies from "js-cookie";
import { Notifications } from "../components/notification";
import { Toaster } from "react-hot-toast";
export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar userName={Cookies.get("username")} />
      <Notifications />
      <Toaster />
      {children}
    </>
  );
}
