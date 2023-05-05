import { Server, Socket } from "socket.io";

/// Presence handler
export function registerPresenceHandler(io: Server, socket: Socket, roomId: string, client: any) {
    socket.to(roomId).emit("presence_join", { client: client, memberId: socket.id, time: Date.now() });
    console.log(`User ${socket.id} connected to room ${roomId}`);
    console.log(socket.client.conn.transport.name);

    socket.on("disconnect", async () => {
        console.log(`User ${socket.id} disconnected from room ${roomId}`);
        socket.to(roomId).emit("presence_leave", { client: client, memberId: socket.id, time: Date.now() });
    });

    socket.on("presence_signal", async () => {
        console.log(`User ${socket.id} signaled presence in room ${roomId}`);
        socket.to(roomId).emit("presence_signal", { client: client, memberId: socket.id, time: Date.now() });
    });
}
