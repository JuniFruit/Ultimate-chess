import { Server, Socket } from "socket.io";
import { IClientEvents } from "../constants/socketIO/ClientEvents.interface";
import { IServerEvents } from "../constants/socketIO/ServerEvents.interface";
import { RoomService } from "../socket-service/room.service";
import { BoardService } from '../socket-service/board.service';
import { ChatService } from '../socket-service/chat.service';
import { Errors, Requests } from "../../../client/src/constants/constants";
import { observerGuard } from '../guards/observer.guard';


export const roomListener = (socket: Socket<IClientEvents, IServerEvents>, ioServer: Server<IClientEvents, IServerEvents>) => {

    socket.on("joinGameRoom", async (id) => {
        try {
            if (id.includes('_obs')) return socket.emit('gameError', Errors.INVALID_ROOM);
            RoomService.join(socket, id)
            RoomService.onRoomJoin(ioServer, id, socket)

        } catch (error) {
            socket.emit('error', Errors.INTERNAL)
        }
    })
    socket.on("inGameRequest", (payload: Requests) => {
        try {
            if (observerGuard(socket)) return;
            RoomService.onRequest(socket, payload)
        } catch (error) {
            socket.emit('error', Errors.INTERNAL)
        }
    })



}

export const gameListener = (socket: Socket<IClientEvents, IServerEvents>, ioServer: Server<IClientEvents, IServerEvents>) => {

    socket.on("sendMove", (payload) => {
        try {
            if (observerGuard(socket)) return;
            BoardService.handleMove(socket, payload, ioServer);
            BoardService.checkResults(ioServer, socket.data.room)

        } catch (error) {
            socket.emit('error', Errors.INTERNAL)
        }

    })
    socket.on("timeout", () => {
        try {
            if (observerGuard(socket)) return;
            BoardService.onTimeout(ioServer, socket)

        } catch (error) {
            socket.emit('error', Errors.INTERNAL)
        }
    })
    socket.on("confirmRequest", (payload: Requests) => {
        try {
            if (observerGuard(socket)) return;
            BoardService.onConfirmRequest(ioServer, payload, socket.data.room)

        } catch (error) {
            socket.emit('error', Errors.INTERNAL)
        }
    });
    socket.on("resign", () => {
        try {
            if (observerGuard(socket)) return;
            BoardService.onResign(ioServer, socket.data.room, socket.data.user.username)
        } catch (error) {
            socket.emit('error', Errors.INTERNAL)
        }
    });
    socket.on("disconnectTimeout", (user) => {
        try {
            if (observerGuard(socket)) return;
            BoardService.onResign(ioServer, socket.data.room, user.username)

        } catch (error) {
            socket.emit('error', Errors.INTERNAL)
        }
    });


}


export const chatListener = (socket: Socket<IClientEvents, IServerEvents>) => {

    socket.on("message", (payload) => {
        try {

            ChatService.onMessage(socket, payload)
        } catch (error) {
            socket.emit('error', Errors.INTERNAL)
        }
    })
}




export const serverListener = (socket: Socket<IClientEvents, IServerEvents>, ioServer: Server<IClientEvents, IServerEvents>) => {

    socket.on("ping", (cb) => {
        try {
            cb();
        } catch (error) {
            socket.emit('error', Errors.INTERNAL)
        }
    })

    socket.on("currentGames", () => {
        try {

            socket.emit("currentGames", RoomService.getCurrentGames(ioServer.of('/').adapter.rooms))

        } catch (error) {
            socket.emit('error', Errors.INTERNAL)
        }
    })

    socket.on('disconnect', (reason) => {
        try {
            console.log(reason);
            RoomService.onRoomLeave(socket, ioServer)
        } catch (error) {
            socket.emit('error', Errors.INTERNAL)
        }
    });
    // socket.onAny(() => console.log(ioServer.of('/').adapter.rooms))


}