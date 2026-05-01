"use client";

import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (typeof window === "undefined") {
    throw new Error("getSocket() called on server");
  }
  if (!socket) {
    socket = io({ path: "/api/socket", transports: ["websocket", "polling"] });
  }
  return socket;
}
