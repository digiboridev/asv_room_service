import { Server, Socket } from "socket.io";

/// RTC events handler
export function registerRtcHandler(io: Server, socket: Socket) {
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
}
