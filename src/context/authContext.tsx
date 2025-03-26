// app/providers/auth-provider.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";

type AuthContextType = {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check token on initial load
    const storedToken = Cookies.get("token");
    if (storedToken) setToken(storedToken);
  }, []);

  const login = (newToken: string) => {
    Cookies.set("token", newToken);
    setToken(newToken);
    router.push("/dashboard");
  };

  const logout = () => {
    Cookies.remove("token");
    setToken(null);
    router.push("/login");
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
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
