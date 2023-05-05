import { Server, Socket } from "socket.io";

interface RTCEvent {
    to: string;
    from: string;
}

interface Offer extends RTCEvent {
    offer: { sdp: string; type: string };
}

interface Answer extends RTCEvent {
    answer: { sdp: string; type: string };
}

interface IceCandy extends RTCEvent {
    candidate: { candidate: string; sdpMid: string; sdpMLineIndex: number };
    pc_type: string;
}

/// RTC events handler
export function registerRtcHandler(io: Server, socket: Socket) {
    socket.on("rtc_warmup_ack", async (data: RTCEvent, ack: (s: string) => void) => {
        console.log(`rtc_warmup: ${data.from} -> ${data.to}`);
        try {
            var response = await io.timeout(1000).to(data.to).emitWithAck("rtc_warmup_ack", data);
            ack(response[0]);
        } catch (error) {
            ack("timeout");
        }
    });

    socket.on("rtc_offer", (data: Offer) => {
        console.log(`rtc_offer: ${data.from} -> ${data.to}`);
        io.to(data.to).emit("rtc_offer", data);
    });

    socket.on("rtc_answer", (data: Answer) => {
        console.log(`rtc_answer: ${data.from} -> ${data.to}`);
        io.to(data.to).emit("rtc_answer", data);
    });

    socket.on("rtc_candidate", (data: IceCandy) => {
        console.log(`rtc_candidate: ${data.from} -> ${data.to}`);
        io.to(data.to).emit("rtc_candidate", data);
    });
}
