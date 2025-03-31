"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { MdDarkMode } from "react-icons/md";
import { MdLightMode } from "react-icons/md";
import Button from "./button";

export default function DarkModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {}, [theme]);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <Button
      type="button"
      className="p-2 rounded-lg  focus:outline-none focus:shadow-outline"
      icon={theme === "dark" ? <MdLightMode /> : <MdDarkMode />}
      onClick={toggleTheme}
    ></Button>
  );
}
