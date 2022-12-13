import { Server, Socket } from 'socket.io';
import { IClientEvents } from '../constants/socketIO/ClientEvents.interface';
import { IServerEvents, IStartData } from '../constants/socketIO/ServerEvents.interface';
import { Errors, Requests } from '../../../client/src/constants/constants';
import { roomApi } from '../model/room';
import { BoardService } from './board.service';
import { boardApi } from '../model/board';


export const RoomService = {

    async join(socket: Socket<IClientEvents, IServerEvents>, roomId: string) {
        socket.data.room = roomId
        socket.join(roomId);
    },

    async onRoomJoin(ioServer: Server<IClientEvents, IServerEvents>, roomId: string) {

        const sockets = await ioServer.in(roomId).fetchSockets()
        const roomInfo = roomApi(roomId).getRoomInfo();

        if (sockets.length === 2 && !roomInfo.isGameStarted) {

            if (sockets[0].data.user?.username === sockets[1].data.user?.username) return sockets[0].emit('gameError', Errors.SAME_PLAYER)

            BoardService.onGlobalUpdate(sockets);
            roomApi(roomId).updateRoomInfo({ isGameStarted: true, result: null });
        };
        if (sockets.length === 2 && roomInfo.isGameStarted) {
            
            await this.onRoomRejoin(ioServer, roomId);
            return;
        }

    },

    async onRoomRejoin(ioServer: Server<IClientEvents, IServerEvents>, roomId: string) {
        const sockets = await ioServer.in(roomId).fetchSockets()
        const players = roomApi(roomId).getRoomInfo().players;
        const roomResult = roomApi(roomId).getRoomInfo().result;
        if (!players) return;
        
        const myInfo = players.find(player => player.username === sockets[1].data.user?.username);
        if (myInfo) {
            sockets[1].data.color = myInfo.color;
            sockets[1].data.opponentUser = myInfo.opponent;
            sockets[1].emit("updateGame", BoardService.getUpdateGamePayload(sockets[1], roomId));
            
            ioServer.in(roomId).emit("reconnect");
            if (roomResult) return sockets[1].emit("results", roomResult);
        }
    },

    onRequest(socket: Socket<IClientEvents, IServerEvents>, payload: Requests) {
        socket.to(socket.data.room).emit("inGameRequest", payload);
    },

    async onRoomLeave(socket: Socket<IClientEvents, IServerEvents, any, IStartData>, ioServer: Server<IClientEvents, IServerEvents>) {
        const roomId = socket.data.room;
        if (!roomId) return;
        if (roomId.includes('_obs')) return;
        const sockets = await ioServer.in(roomId).fetchSockets();

        if (sockets.length === 0) {
            this.clearGameRoom(roomId);
            ioServer.in(roomId).emit("noPlayers");
        }

        ioServer.in(roomId).emit("noOpponent", {
            username: socket.data.user?.username!,
            color: socket.data.color!,
            id: socket.data.user?.id!
        });
    },

    clearGameRoom(roomId: string) {
        boardApi(roomId).clearBoard();
        roomApi(roomId).clearRoom();
    }
}