// "use client";
// import { createContext, useContext, useEffect, useState } from "react";
// import { io, Socket } from "socket.io-client";
// import Cookies from "js-cookie";

// type SocketContextType = {
//   socket: Socket | null;
//   notifications: Notification[];
//   addNotification: (notification: Notification) => void;
//   registerUser: (userId: string) => void; // Add this line
// };

// const SocketContext = createContext<SocketContextType>({
//   socket: null,
//   notifications: [],
//   addNotification: () => {},
//   registerUser: () => {}, // Add this line
// });

// type Notification = {
//   id: string;
//   message: string;
//   task?: any;
//   read: boolean;
//   timestamp: Date;
// };

// export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
//   const [socket, setSocket] = useState<Socket | null>(null);
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [currentUserId, setCurrentUserId] = useState<string | null>(null);
//   const addNotification = (notification: Notification) => {
//     setNotifications((prev) => [notification, ...prev]);
//   };

//   // Add this function
//   const registerUser = (userId: string) => {
//     setCurrentUserId(userId);
//     if (socket && userId) {
//       console.log(`Registering user ${userId} with socket`);
//     }
//   };

//   useEffect(() => {
//     const socketInstance = io(
//       process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000",
//       {
//         withCredentials: true,
//         auth: { token: Cookies.get("token") },
//       }
//     );

//     // Only set up listeners once
//     socketInstance.on("connect", () => {
//       console.log("Socket connected");
//       if (currentUserId) {
//         socketInstance.emit("registerUser", currentUserId);
//       }
//     });

//     // Listen for task assignments
//     socketInstance.on("taskAssigned", (data) => {
//       console.log(data);
//       if (data.toUser && data.toUser.toString() === currentUserId?.toString()) {
//       addNotification({
//         id: Date.now().toString(),
//         message: data.message,
//         task: data.task,
//         read: false,
//         timestamp: new Date(),
//       });
//     }
//     });

//     setSocket(socketInstance);

//     return () => {
//       socketInstance.off("taskAssigned");
//       socketInstance.disconnect();
//     };
//   }, [currentUserId]);

//   return (
//     <SocketContext.Provider
//       value={{ socket, notifications, addNotification, registerUser }} // Add registerUser here
//     >
//       {children}
//     </SocketContext.Provider>
//   );
// };

// export const useSocket = () => useContext(SocketContext);


"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";

type SocketContextType = {
  socket: Socket | null;
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  registerUser: (userId: string) => void;
  subscribeToTaskMoved: (callback: (data: any) => void) => void;
  unsubscribeFromTaskMoved: () => void;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  notifications: [],
  addNotification: () => {},
  registerUser: () => {},
  subscribeToTaskMoved: () => {},
  unsubscribeFromTaskMoved: () => {},
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
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [taskMovedCallback, setTaskMovedCallback] = useState<((data: any) => void) | null>(null);

  const addNotification = (notification: Notification) => {
    setNotifications((prev) => [notification, ...prev]);
  };

  const registerUser = (userId: string) => {
    setCurrentUserId(userId);
    if (socket && userId) {
      console.log(`Registering user ${userId} with socket`);
    }
  };

  const subscribeToTaskMoved = (callback: (data: any) => void) => {
    setTaskMovedCallback(() => callback);
  };

  const unsubscribeFromTaskMoved = () => {
    setTaskMovedCallback(null);
  };

  useEffect(() => {
    const socketInstance = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000",
      {
        withCredentials: true,
        auth: { token: Cookies.get("token") },
      }
    );

    socketInstance.on("connect", () => {
      console.log("Socket connected");
      if (currentUserId) {
        socketInstance.emit("registerUser", currentUserId);
      }
    });

    socketInstance.on("taskAssigned", (data) => {
      console.log(data);
      if (data.toUser && data.toUser.toString() === currentUserId?.toString()) {
        addNotification({
          id: Date.now().toString(),
          message: data.message,
          task: data.task,
          read: false,
          timestamp: new Date(),
        });
      }
    });

    socketInstance.on("taskMoved", (data) => {
      console.log("Task moved event received:", data);
      if (taskMovedCallback) {
        taskMovedCallback(data);
      }
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.off("taskAssigned");
      socketInstance.off("taskMoved");
      socketInstance.disconnect();
    };
  }, [currentUserId, taskMovedCallback]);

  return (
    <SocketContext.Provider
      value={{ 
        socket, 
        notifications, 
        addNotification, 
        registerUser,
        subscribeToTaskMoved,
        unsubscribeFromTaskMoved
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
