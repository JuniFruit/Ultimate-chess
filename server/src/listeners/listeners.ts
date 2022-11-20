import { Socket } from "socket.io";
import { Adapter } from "socket.io-adapter";
import { RoomService } from "../socket-service/room.service";
import { EMIT_EVENTS } from '../constants/emitEvents';

export const roomListener = (socket:Socket, adapter: Adapter) => {
    
    socket.on(EMIT_EVENTS.JOIN_GAME_ROOM, ({roomId}) => RoomService.join(socket, roomId));

    adapter.on('join-room', async (room) => RoomService.onRoomJoin(await adapter.fetchSockets({rooms:room})))
}