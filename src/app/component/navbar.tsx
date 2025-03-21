"use client";
import { ThemeContext, ThemeSwitcher } from "@/context/themeContext"; // Assuming your context is in this path
import { NavbarProps } from "@/types/navbar";
import { useContext } from "react";

export default function Navbar({ userName }: NavbarProps) {
  const { theme, toggleTheme } = useContext(ThemeContext);

  const bgColor = theme === "light" ? "bg-white" : "bg-gray-800";
  const textColor = theme === "light" ? "text-gray-900" : "text-white";

  return (
    <header className={`${bgColor} shadow-md ${textColor}`}>
      <div className=" mx-auto flex justify-between items-center py-4 px-6">
        <div className="flex items-center">
          <span className="font-semibold text-xl">{"Kanban Board"}</span>
        </div>

        <div className="flex items-center">
          <span className="mx-2">
            <ThemeSwitcher />
          </span>
          <span className="font-semibold text-xl">
            {"Welcome" + " " + (userName || "User")}
          </span>
        </div>
      </div>
    </header>
  );
}
