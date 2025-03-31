// app/providers/auth-provider.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";

type AuthContextType = {
  token: string | null;
  userName: string | "";
  login: (
    token: string,
    username: string,
    role: string,
    userId: string
  ) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | "">("");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check token on initial load
    const storedToken = Cookies.get("token");
    if (storedToken) setToken(storedToken);
  }, []);

  const login = (
    newToken: string,
    username: string,
    role: string,
    userId: string
  ) => {
    Cookies.set("token", newToken, { expires: 365 });
    Cookies.set("username", username);
    setToken(newToken);
    setUserName(username);
    localStorage.setItem("username", username);
    localStorage.setItem("role", role);
    localStorage.setItem("userId", userId);
    router.push("/dashboard");
  };

  const logout = () => {
    Cookies.remove("token");
    setToken(null);
    setUserName("");
    Cookies.remove("token");
    Cookies.remove("username");
    router.push("/login");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
  };

  // Protect routes on client side
  useEffect(() => {
    const isProtectedRoute = pathname.startsWith("/dashboard");
    if (!token && isProtectedRoute) {
      router.push("/login");
    } else if (token && pathname === "/login") {
      router.push("/dashboard");
    }
  }, [token, pathname, router]);

  return (
    <AuthContext.Provider value={{ token, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
