import { Server } from "socket.io";
import * as dotenv from "dotenv";
import { createRoomServer } from "./room_server_factory";

dotenv.config();

const io:Server = createRoomServer();
const port = process.env.PORT || 3000;
io.listen(port as number);
console.log("listening on port $port");

