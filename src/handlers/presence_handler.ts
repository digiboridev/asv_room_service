import { Server, Socket } from "socket.io";
import { Client } from "../models/client";

/// Presence handler
export function registerPresenceHandler(io: Server, socket: Socket, roomId: string, client: Client) {
    socket.to(roomId).emit("presence_join", { client: client, memberId: socket.id, time: Date.now() });
    console.log(`User ${socket.id} connected to room ${roomId}`);
    console.log("Transport: " + socket.client.conn.transport.name);

    socket.on("disconnect", () => {
        console.log(`User ${socket.id} disconnected from room ${roomId}`);
        socket.to(roomId).emit("presence_leave", { client: client, memberId: socket.id, time: Date.now() });
    });

    socket.on("presence_signal", () => {
        console.log(`User ${socket.id} signaled presence in room ${roomId}`);
        socket.to(roomId).emit("presence_signal", { client: client, memberId: socket.id, time: Date.now() });
    });
}
