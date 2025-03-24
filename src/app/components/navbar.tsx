"use client";
import { NavbarProps } from "@/types/navbar";
import DarkModeToggle from "./darkMode";
import { useTheme } from "next-themes";
import { navBgColor, textColor } from "@/utils/color";

export default function Navbar({ userName }: NavbarProps) {
  const { theme } = useTheme();

  return (
    <header className={`${navBgColor(theme)} shadow-md `}>
      <div className=" mx-auto flex justify-between items-center py-4 px-6">
        <div className="flex items-center">
          <span className="font-semibold text-xl">{"Kanban Board"}</span>
        </div>

        <div className="flex items-center">
          <span className="mx-2">
            <DarkModeToggle />
          </span>
          <span className="font-semibold text-xl">
            {"Welcome" + " " + (userName || "User")}
          </span>
        </div>
      </div>
    </header>
  );
}
