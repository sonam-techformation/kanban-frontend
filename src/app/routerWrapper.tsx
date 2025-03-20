"use client";
import Image from "next/image";
import Register from "./register/page";
import Dashboard from "./dashboard/page";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./login";

export default function RouterWrapper() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Login />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" index element={<Dashboard />} />
        <Route path="/dashboard" index element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
