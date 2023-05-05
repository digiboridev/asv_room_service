import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import { Client } from "../models/client";

/// Auth middleware
export function authMiddleware(socket: Socket, next: (err?: ExtendedError | undefined) => void) {
    // Extract auth data from connection request
    const apiKey: string = socket.handshake.auth.apiKey;
    const roomId: string = socket.handshake.auth.roomId;
    const client: Client = socket.handshake.auth.client;

    // Validate auth request

    if (apiKey != process.env.APIKEY) {
        const error = new Error("Authentication error, key mismatch");
        console.log(error.message);
        return next(error);
    }

    if (!roomId) {
        const error = new Error("Authentication error, no room id");
        console.log(error.message);
        return next(error);
    }

    if (!client) {
        const error = new Error("Authentication error, no client");
        console.log(error.message);
        return next(error);
    }

    // Save auth data to socket
    socket.data.roomId = roomId;
    socket.data.client = client;

    next();
}
