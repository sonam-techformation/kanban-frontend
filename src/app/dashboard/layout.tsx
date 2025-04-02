"use client";
import Navbar from "../components/navbar";
import { Notifications } from "../components/notification";
import { Toaster } from "react-hot-toast";
import { Suspense } from "react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <Notifications />
      <Toaster />
      <Suspense>{children}</Suspense>
    </>
  );
}
