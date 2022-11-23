import { Socket } from "socket.io";
import { Adapter } from "socket.io-adapter";
import { RoomService } from "../socket-service/room.service";

export const roomListener = (socket:Socket, adapter: Adapter) => {
    
    socket.on("joinGameRoom", (id) => RoomService.join(socket, id));

    adapter.on('join-room', async (room) => RoomService.onRoomJoin(await adapter.fetchSockets({rooms:room})))
}