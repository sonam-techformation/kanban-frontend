"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";

type SocketContextType = {
  socket: Socket | null;
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  registerUser: (userId: string) => void; // Add this line
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  notifications: [],
  addNotification: () => {},
  registerUser: () => {}, // Add this line
});

type Notification = {
  id: string;
  message: string;
  task?: any;
  read: boolean;
  timestamp: Date;
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Notification) => {
    setNotifications((prev) => [notification, ...prev]);
  };

  // Add this function
  const registerUser = (userId: string) => {
    if (socket && userId) {
      socket.emit("registerUser", userId);
      console.log(`Registering user ${userId} with socket`);
    }
  };

  useEffect(() => {
    const socketInstance = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000",
      {
        withCredentials: true,
        auth: { token: Cookies.get("token") },
      }
    );

    // Listen for task assignments
    socketInstance.on("taskAssigned", (data) => {
      console.log(data);
      addNotification({
        id: Date.now().toString(),
        message: data.message,
        task: data.task,
        read: false,
        timestamp: new Date(),
      });
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.off("taskAssigned");
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{ socket, notifications, addNotification, registerUser }} // Add registerUser here
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
