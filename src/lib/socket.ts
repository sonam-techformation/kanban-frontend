// // hooks/useSocket.ts
// import { useEffect, useState } from "react";
// import { io, Socket } from "socket.io-client";

// const useSocket = () => {
//   const [socket, setSocket] = useState<Socket | null>(null);

//   useEffect(() => {
//     // Initialize the socket connection
//     const newSocket: Socket = io("http://localhost:3000"); // Replace with your backend URL

//     setSocket(newSocket);

//     // Cleanup on unmount
//     return () => {
//       newSocket.disconnect();
//     };
//   }, []);

//   return socket;
// };

// export default useSocket;
