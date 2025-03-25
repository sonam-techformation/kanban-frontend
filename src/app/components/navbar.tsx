"use client";
import { NavbarProps } from "@/types/navbar";
import DarkModeToggle from "./darkMode";
import { useTheme } from "next-themes";
import { navBgColor } from "@/utils/color";
import { MdLogout } from "react-icons/md";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
export default function Navbar({ userName }: NavbarProps) {
  const { theme } = useTheme();
  const router = useRouter();
  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("username");
    router.push("/login");
  };
  return (
    <header className={`${navBgColor(theme)} shadow-md `}>
      <div className=" mx-auto flex justify-between items-center py-4 px-6">
        <div className="flex items-center">
          <span className="font-semibold text-xl">{"Kanban Board"}</span>
        </div>

        <div className="flex items-center justify-center ">
          <span className="mx-2">
            <DarkModeToggle />
          </span>
          <span className="font-semibold text-xl">
            {"Welcome" +
              " " +
              (userName
                ? userName!.replace(/\b\w/g, (char) => char.toUpperCase())
                : "")}
          </span>
          <div onClick={logout} className="mx-2 cursor-pointer" title="Logout">
            <MdLogout size={20} />
          </div>
        </div>
      </div>
    </header>
  );
}
