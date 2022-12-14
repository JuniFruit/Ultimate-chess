import { Server, Socket } from "socket.io";
import { IClientEvents } from "../constants/socketIO/ClientEvents.interface";
import { IServerEvents } from "../constants/socketIO/ServerEvents.interface";
import { RoomService } from "../socket-service/room.service";
import { BoardService } from '../socket-service/board.service';
import { ChatService } from '../socket-service/chat.service';
import { Errors, Requests } from "../../../client/src/constants/constants";
import { observerGuard } from '../guards/observer.guard';


export const roomListener = (socket: Socket<IClientEvents, IServerEvents>, ioServer: Server<IClientEvents, IServerEvents>) => {
    try {
        socket.on("joinGameRoom", async (id) => {
            RoomService.join(socket, id)
            RoomService.onRoomJoin(ioServer, id, socket)
        })
        socket.on("inGameRequest", (payload: Requests) => {
            if (observerGuard(socket)) return;
            RoomService.onRequest(socket, payload)
        })


    } catch (error) {
        socket.emit('gameError', Errors.INTERNAL)
    }
}

export const gameListener = (socket: Socket<IClientEvents, IServerEvents>, ioServer: Server<IClientEvents, IServerEvents>) => {
    try {
        socket.on("sendMove", (payload) => {
            if (observerGuard(socket)) return;
            BoardService.handleMove(socket, payload, ioServer);
            BoardService.checkResults(ioServer, socket.data.room)

        })
        socket.on("timeout", () => {
            if (observerGuard(socket)) return;
            BoardService.onTimeout(ioServer, socket)
        })
        socket.on("confirmRequest", (payload: Requests) => {
            if (observerGuard(socket)) return;
            BoardService.onConfirmRequest(ioServer, payload, socket.data.room)
        });
        socket.on("resign", () => {
            if (observerGuard(socket)) return;
            BoardService.onResign(ioServer, socket.data.room, socket.data.user.username)
        });
        socket.on("disconnectTimeout", (user) => {
            if (observerGuard(socket)) return;
            BoardService.onResign(ioServer, socket.data.room, user.username)
        });

    } catch (error: any) {
        socket.emit('gameError', Errors.INTERNAL)
    }
}


export const chatListener = (socket: Socket<IClientEvents, IServerEvents>) => {
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
            socket.emit("currentGames", RoomService.getCurrentGames(ioServer.of('/').adapter.rooms))
        })

        socket.on('disconnect', (reason) => { console.log(reason);RoomService.onRoomLeave(socket, ioServer)});
        // socket.onAny(() => console.log(ioServer.of('/').adapter.rooms))

    } catch (error) {
        console.log(error);

    }
}