import { Server, Socket } from "socket.io";
import { Adapter } from "socket.io-adapter";
import { IClientEvents } from "../constants/socketIO/ClientEvents.interface";
import { IServerEvents } from "../constants/socketIO/ServerEvents.interface";
import { RoomService } from "../socket-service/room.service";
import { BoardService } from '../socket-service/board.service';

export const roomListener = (socket: Socket<IClientEvents, IServerEvents>, ioServer: Server<IClientEvents,IServerEvents>) => {

    socket.on("joinGameRoom", async (id) => {
        RoomService.join(socket, id)

        const sockets = await ioServer.in(id).fetchSockets()
        RoomService.onRoomJoin(sockets, id)
    })
    
    // adapter.on('join-room', async (room) => RoomService.onRoomJoin(await adapter.fetchSockets({ rooms: room }), room))
    // console.log(adapter.rooms);
}

export const gameListener = (socket: Socket<IClientEvents, IServerEvents>, ioServer: Server<IClientEvents,IServerEvents>) => {
    socket.on("sendMove", (payload) => {
        BoardService.handleMove(socket, payload);
        BoardService.checkResults(ioServer, socket.data.room)
    })
}