import { Server } from "socket.io";
import { Message } from "./models/message";
import * as dotenv from "dotenv";

dotenv.config();

const io = new Server();

io.use(async (socket, next) => {
    const apiKey = socket.handshake.auth.apiKey;
    const roomId = socket.handshake.auth.roomId;

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

    socket.data.roomId = roomId;
    next();
});

io.on("connection", async (socket) => {
    const roomId = socket.data.roomId;

    socket.join([roomId]);

    // Presence events
    socket.to(roomId).emit("presence_join", { memberId: socket.id, time: Date.now() });
    console.log(`User ${socket.id} connected to room ${roomId}`);

    socket.on("disconnect", async () => {
        console.log(`User ${socket.id} disconnected from room ${roomId}`);
        socket.to(roomId).emit("presence_leave", { memberId: socket.id, time: Date.now() });
    });

    socket.on("presence_signal", async () => {
        socket.to(roomId).emit("presence_signal", { memberId: socket.id, time: Date.now() });
    });
    // End presence events

    // Chat events
    socket.on("msg", async (msg: Message) => {
        console.log(`User ${socket.id} sent message to room ${roomId}:`);
        console.log(msg.text);
        io.to(roomId).emit("msg", msg);
    });

    socket.on("typing", async () => {
        console.log(`User ${socket.id} is typing in room ${roomId}`);
        socket.to(roomId).emit("typing", { memberId: socket.id });
    });

    socket.on("typing_cancel", async () => {
        console.log(`User ${socket.id} stopped typing in room ${roomId}`);
        socket.to(roomId).emit("typing_cancel", { memberId: socket.id });
    });
    // End chat events

    // RTC events
    socket.on("rtc_warmup_ack", async (data, ack) => {
        try {
            var response = await io.timeout(1000).to(data.to).emitWithAck("rtc_warmup_ack", data);
            console.log(response);
            ack(response[0]);
        } catch (error) {
            console.log("timeout");
            ack("timeout");
        }
    });

    socket.on("rtc_offer", async (data) => {
        io.to(data.to).emit("rtc_offer", data);
    });

    socket.on("rtc_answer", async (data) => {
        io.to(data.to).emit("rtc_answer", data);
    });

    socket.on("rtc_candidate", async (data) => {
        io.to(data.to).emit("rtc_candidate", data);
    });
    // End RTC events
});

io.listen(3000);

console.log("listening on port 3000");
