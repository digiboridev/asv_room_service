import { Server } from "socket.io";
import { Message } from "./models/message";

const io = new Server();

io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    const roomId = socket.handshake.auth.roomId;
    const clientId = socket.handshake.auth.clientId;

    if (token != "123123") {
        console.log("not authenticated");
        next(new Error("authentication error"));
        return;
    }

    if (!roomId) {
        console.log("no room id");
        next(new Error("no room id"));
        return;
    }

    if (!clientId) {
        console.log("no client id");
        next(new Error("no client id"));
        return;
    }

    socket.data.roomId = roomId;
    socket.data.clientId = clientId;
    next();
});

io.on("connection", async (socket) => {
    const roomId = socket.data.roomId;
    const clientId = socket.data.clientId;

    socket.join([roomId, clientId]);
    socket.to(roomId).emit("join", { clientId: clientId, time: Date.now() });
    console.log(`User ${clientId} connected to room ${roomId}`);

    socket.on("disconnect", async () => {
        console.log(`User ${clientId} disconnected from room ${roomId}`);
        socket.to(roomId).emit("leave", { clientId: clientId, time: Date.now() });
    });

    socket.on("msg", async (msg: Message) => {
        console.log(`User ${clientId} sent message to room ${roomId}:`);
        console.log(msg.text);
        io.to(roomId).emit("msg", msg);
    });

    socket.on("typing", async () => {
        console.log(`User ${clientId} is typing in room ${roomId}`);
        socket.to(roomId).emit("typing", { clientId: clientId });
    });

    socket.on("typing_cancel", async () => {
        console.log(`User ${clientId} stopped typing in room ${roomId}`);
        socket.to(roomId).emit("typing_cancel", { clientId: clientId });
    });

    socket.on("rtc_offer", async (data) => {
        console.log("rtc_offer", data);
        io.to(data.to).emit("rtc_offer", data);
    });

    socket.on("rtc_answer", async (data) => {
        console.log("rtc_answer", data);
        io.to(data.to).emit("rtc_answer", data);
    });

    socket.on("rtc_candidate", async (data) => {
        console.log("rtc_candidate", data);
        io.to(data.to).emit("rtc_candidate", data);
    });
});

io.listen(3000);
console.log("listening on port 3000");
