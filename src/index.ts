import { Server } from "socket.io";
import * as dotenv from "dotenv";
import { createRoomServer } from "./room_server_factory";

dotenv.config();

const io:Server = createRoomServer();
io.listen(3000);
console.log("listening on port 3000");


