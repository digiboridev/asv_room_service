import { Server } from "socket.io";
import { authMiddleware } from "./middlewares/auth_middleware";
import { registerPresenceHandler } from "./handlers/presence_handler";
import { registerChatHandler } from "./handlers/chat_events_handler";
import { registerRtcHandler } from "./handlers/rtc_events_handler";


// Create room server and setup handlers
export function createRoomServer() : Server{
    const io = new Server();

    io.use(authMiddleware);

    io.on("connection", async (socket) => {
        const roomId = socket.data.roomId;
        const client = socket.data.client;

        socket.join([roomId]);

        registerPresenceHandler(io, socket, roomId, client);
        registerChatHandler(io, socket, roomId, client);
        registerRtcHandler(io, socket);
    });

    return io;
}