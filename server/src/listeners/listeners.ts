import { Server, Socket } from "socket.io";
import { IClientEvents } from "../constants/socketIO/ClientEvents.interface";
import { IServerEvents } from "../constants/socketIO/ServerEvents.interface";
import { RoomService } from "../socket-service/room.service";
import { BoardService } from '../socket-service/board.service';
import { ChatService } from '../socket-service/chat.service';
import { Errors, Requests } from "../../../client/src/constants/constants";
import { getCurrentGames } from "../utils/utils";


export const roomListener = (socket: Socket<IClientEvents, IServerEvents>, ioServer: Server<IClientEvents, IServerEvents>) => {
    try {
        socket.on("joinGameRoom", async (id) => {
            RoomService.join(socket, id)
            RoomService.onRoomJoin(ioServer, id)
        })
        socket.on("inGameRequest", (payload: Requests) => RoomService.onRequest(socket, payload))


    } catch (error) {
        socket.emit('gameError', Errors.INTERNAL)
    }
}

export const gameListener = (socket: Socket<IClientEvents, IServerEvents>, ioServer: Server<IClientEvents, IServerEvents>) => {
    try {
        socket.on("sendMove", (payload) => {
            BoardService.handleMove(socket, payload, ioServer);
            BoardService.checkResults(ioServer, socket.data.room)

        })
        socket.on("timeout", () => BoardService.onTimeout(ioServer, socket))
        socket.on("confirmRequest", (payload: Requests) => BoardService.onConfirmRequest(ioServer, payload, socket.data.room));
        socket.on("resign", () => BoardService.onResign(ioServer, socket.data.room, socket.data.color));
        socket.on("disconnectTimeout", (user) => BoardService.onResign(ioServer, socket.data.room, user.color));

    } catch (error: any) {
        socket.emit('gameError', Errors.INTERNAL)
    }
}


export const chatListener = (socket: Socket<IClientEvents, IServerEvents>, ioServer: Server<IClientEvents, IServerEvents>) => {
    try {
        socket.on("message", (payload) => ChatService.onMessage(socket, payload))

    } catch (error) {
        console.log(error);
    }
}


export const serverListener = (socket: Socket<IClientEvents, IServerEvents>, ioServer: Server<IClientEvents, IServerEvents>) => {
    try {
        socket.on("ping", (cb) => {
            cb();
        })

        socket.on("currentGames", () => {
            socket.emit("currentGames", getCurrentGames(ioServer.of('/').adapter.rooms))
        })

        socket.on('disconnect', () => RoomService.onRoomLeave(socket, ioServer));


    } catch (error) {
        console.log(error);

    }
}