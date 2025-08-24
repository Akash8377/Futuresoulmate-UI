import { io } from "socket.io-client";
import config from "../config";

let socket = null;

export const connectSocket = (token) => {
  if (socket && socket.connected) return socket;

  socket = io(config.baseURL, {
    transports: ["websocket"],
    reconnectionAttempts: 5,
    auth: { token },
    autoConnect: true,
    withCredentials: true
  });

  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("❌ Socket disconnected:", reason);
  });

  socket.on("connect_error", (err) => {
    console.error("❗Socket connection error:", err.message);
    setTimeout(() => socket.connect(), 5000);
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};





// import { io } from "socket.io-client";
// import config from "../config";

// let socket = null;

// export const connectSocket = (token) => {
//   if (socket) return socket;
//   socket = io(config.baseURL, {
//     transports: ["websocket"],
//     reconnectionAttempts: 5,
//     auth: { token }, // pass token securely here
//     query: { 
//       timestamp: Date.now() // Ensure unique connection
//     }
//   });

//   socket.on("connect", () => {
//     console.log("✅ Socket connected:", socket.id);
//   });

//   socket.on("disconnect", (reason) => {
//     console.log("❌ Socket disconnected:", reason);
//   });

//   socket.on("connect_error", (err) => {
//     console.error("❗Socket connection error:", err.message);
//   });
// };

// export const getSocket = () => socket;

// export const disconnectSocket = () => {
//   if (socket) {
//     socket.disconnect();
//     socket = null;
//   }
// };