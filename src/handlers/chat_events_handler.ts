import { Server, Socket } from "socket.io";
import { Client } from "../models/client";

/// Chat events handler
export function registerChatHandler(io: Server, socket: Socket, roomId: string, client: Client) {
    socket.on("msg", (message: string) => {
        console.log(`User ${socket.id} sent message to room ${roomId}:`);
        console.log("Message: " + message);
        io.to(roomId).emit("msg", {
            client: client,
            message: message,
            time: Date.now(),
        });
    });

    socket.on("typing", () => {
        console.log(`User ${socket.id} is typing in room ${roomId}`);
        socket.to(roomId).emit("typing", {
            client: client,
        });
    });

    socket.on("typing_cancel", () => {
        console.log(`User ${socket.id} stopped typing in room ${roomId}`);
        socket.to(roomId).emit("typing_cancel", {
            client: client,
        });
    });
}
