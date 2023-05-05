import { Server, Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";


/// Auth middleware
export function authMiddleware(socket: Socket, next: (err?: ExtendedError | undefined) => void) {
    // Extract auth data from connection request
    const apiKey = socket.handshake.auth.apiKey;
    const roomId = socket.handshake.auth.roomId;
    const client = socket.handshake.auth.client;

    // Validate auth data
    if (apiKey != process.env.APIKEY) {
        console.log("not authenticated");
        next(new Error("authentication error"));
        return;
    }

    if (!roomId) {
        console.log("no room id");
        next(new Error("no room id"));
        return;
    }

    if (!client) {
        console.log("no client");
        next(new Error("no client"));
        return;
    }

    // Save auth data to socket
    socket.data.roomId = roomId;
    socket.data.client = client;

    next();
}
