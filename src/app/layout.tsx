import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import queryClient from "../lib/react-query";
import { BoardContextProvider } from "@/context/boardContext";
import { ThemeProvider, ThemeSwitcher } from "@/context/themeContext";
import ReactQueryProvider from "@/lib/react-query-provider";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReactQueryProvider>
          {/* <BoardContextProvider> */}
          <ThemeProvider>{children}</ThemeProvider>
          {/* </BoardContextProvider> */}
        </ReactQueryProvider>
      </body>
    </html>
  );
}
