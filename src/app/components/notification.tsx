// components/Notifications.tsx
import { useSocket } from "@/context/socketContext";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

export const Notifications = () => {
  const { socket, addNotification } = useSocket();

  useEffect(() => {
    if (!socket) return;

    // Listen for task assignments
    socket.on("taskAssigned", (data: { message: string; task: any }) => {
      const newNotification = {
        id: Date.now().toString(),
        message: data.message,
        task: data.task,
        read: false,
        timestamp: new Date(),
      };

      addNotification(newNotification);

      // Show toast notification
      toast.success("task assigned to you", {
        duration: 5000,
        position: "top-right",
      });
    });

    return () => {
      socket.off("taskAssigned");
    };
  }, [socket, addNotification]);

  return null;
};
