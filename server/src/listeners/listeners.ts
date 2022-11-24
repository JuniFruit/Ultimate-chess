import { Socket } from "socket.io";
import { Adapter } from "socket.io-adapter";
import { IClientEvents } from "../constants/socketIO/ClientEvents.interface";
import { IServerEvents } from "../constants/socketIO/ServerEvents.interface";
import { RoomService } from "../socket-service/room.service";
import {BoardService} from '../socket-service/board.service';

export const roomListener = (socket:Socket<IClientEvents, IServerEvents>, adapter: Adapter) => {
    
    socket.on("joinGameRoom", (id) => RoomService.join(socket, id));

    adapter.on('join-room', async (room) => RoomService.onRoomJoin(await adapter.fetchSockets({rooms:room}), room))
}

export const gameListener = (socket: Socket<IClientEvents, IServerEvents>, adapter: Adapter) => {
    socket.on("sendMove", (payload) => {
        BoardService.handleMove(socket, payload);
    })
}