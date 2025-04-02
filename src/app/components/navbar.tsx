"use client";
import { NavbarProps } from "@/types/navbar";
import DarkModeToggle from "./darkMode";
import { useTheme } from "next-themes";
import { bgColor, navBgColor } from "@/utils/color";
import { MdLogout } from "react-icons/md";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useSocket } from "@/context/socketContext";
import Link from "next/link";
import { useAuth } from "@/context/authContext";
export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const { socket } = useSocket();
  const router = useRouter();
  const { logout, userName } = useAuth();
  const logOut = () => {
    logout();
    socket?.disconnect();
    setTheme("light");
  };
  return (
    <header className={`${navBgColor(theme)} shadow-md`}>
      <div className="mx-auto flex justify-between items-center py-4 px-6">
        <div className="flex items-center">
          <Link href="/dashboard">
            <span className="font-semibold text-xl">Kanban Board</span>
          </Link>
        </div>

        <div className="flex items-center justify-center">
          <span className="mx-2">
            <DarkModeToggle />
          </span>
          <span className="font-semibold text-xl">
            Welcome{" "}
            {userName
              ? userName.replace(/\b\w/g, (char) => char.toUpperCase())
              : localStorage.getItem("username") &&
                localStorage
                  .getItem("username")!
                  .replace(/\b\w/g, (char) => char.toUpperCase())}
          </span>
          <div onClick={logOut} className="mx-2 cursor-pointer" title="Logout">
            <MdLogout size={20} />
          </div>
        </div>
      </div>
    </header>
  );
}
