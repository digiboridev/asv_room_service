import { Server, Socket } from "socket.io";

/// Chat events handler
export function registerChatHandler(io: Server, socket: Socket, roomId: string, client: any) {
    socket.on("msg", async (message: string) => {
        console.log(`User ${socket.id} sent message to room ${roomId}:`);
        io.to(roomId).emit("msg", {
            client: client,
            message: message,
            time: Date.now(),
        });
    });

    socket.on("typing", async () => {
        console.log(`User ${socket.id} is typing in room ${roomId}`);
        socket.to(roomId).emit("typing", {
            client: client,
        });
    });

    socket.on("typing_cancel", async () => {
        console.log(`User ${socket.id} stopped typing in room ${roomId}`);
        socket.to(roomId).emit("typing_cancel", {
            client: client,
        });
    });
}
