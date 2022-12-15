import { RemoteSocket, Server, Socket } from 'socket.io';
import { IClientEvents } from '../constants/socketIO/ClientEvents.interface';
import { IServerEvents, ISocketDataServer } from '../constants/socketIO/ServerEvents.interface';
import { Errors, Requests } from '../../../client/src/constants/constants';
import { roomApi } from '../model/room';
import { BoardService } from './board.service';
import { boardApi } from '../model/board';
import { IGameRoomShortData, ISocketData } from '../../../client/src/constants/socketIO/ServerEvents.interface';
import { IPlayer, Player } from '../../../client/src/model/Player';
import { GameRules } from '../model/gameRules';


export const RoomService = {

    async join(socket: Socket<IClientEvents, IServerEvents>, roomId: string) {
        socket.data.room = roomId
        socket.data.gameData = {};
        socket.join(roomId);
    },

    async onRoomJoin(ioServer: Server<IClientEvents, IServerEvents>, roomId: string, socket: Socket<IClientEvents, IServerEvents>) {

        const sockets = await ioServer.in(roomId).fetchSockets()
        const roomInfo = roomApi(roomId).getRoomInfo();

        if (sockets.length === 2 && !roomInfo.isGameStarted) {

            if (sockets[0].data.user?.username === sockets[1].data.user?.username) {
                ioServer.to([roomId, `${roomId}_obs`]).emit('gameError', Errors.SAME_PLAYER);
                ioServer.in(roomId).disconnectSockets();
                return;
            }
            this.addPlayersToRoom(sockets, roomId);
            BoardService.onGlobalUpdate(sockets);
            roomApi(roomId).updateRoomInfo({ isGameStarted: true, result: null });
            return;
        };
        if (sockets.length === 2 && roomInfo.isGameStarted) {

            return await this.onRoomRejoin(socket, roomId);
        };
        if (sockets.length > 2) return this.onJoinObserver(sockets[2], roomId);

    },

    async onRoomRejoin(socket: Socket<IClientEvents, IServerEvents>, roomId: string) {

        const roomResult = roomApi(roomId).getRoomInfo().result;

        const myInfo = roomApi(roomId).getPlayer(socket.data.user.username);
        if (myInfo) {
            socket.emit("updateGame", BoardService.getUpdateGamePayload(socket, roomId));
            socket.to([roomId, `${roomId}_obs`]).emit("reconnect");
            if (roomResult) return socket.emit("results", roomResult);
            return;
        }
        return this.onJoinObserver(socket, roomId);
    },

    onRequest(socket: Socket<IClientEvents, IServerEvents>, payload: Requests) {
        socket.to(socket.data.room).emit("inGameRequest", payload);
    },

    async onRoomLeave(socket: Socket<IClientEvents, IServerEvents, any, ISocketDataServer>, ioServer: Server<IClientEvents, IServerEvents>) {
        const roomId = socket.data.room;
        if (!roomId) return;
        if (roomId.includes('_obs')) return;
        const sockets = await ioServer.in(roomId).fetchSockets();

        if (sockets.length === 0) {
            this.clearGameRoom(roomId);
            ioServer.to([roomId, `${roomId}_obs`]).emit("noPlayers");
            return;
        }

        ioServer.to([roomId, `${roomId}_obs`]).emit("noOpponent", {
            username: socket.data.user?.username!

        });
    },

    onJoinObserver(socket: Socket<IClientEvents, IServerEvents> | RemoteSocket<IServerEvents, ISocketDataServer>, roomId: string) {
        const players = roomApi(roomId).getRoomInfo().players;
        if (!players) return;

        socket.data.room = `${roomId}_obs`;
        socket.leave(roomId);
        socket.join(`${roomId}_obs`);
        socket.emit("updateGame", BoardService.getUpdateGamePayload(socket, roomId, true));
    },

    getCurrentGames(rooms: Map<string, Set<string>>) {

        const games: IGameRoomShortData[] = [];

        for (let [room, players] of rooms) {
            if (room.includes('_1min') || room.includes('_10min') || room.includes('_3min')) {
                const players = roomApi(room).getRoomInfo().players;
                if (!players) continue;
                games.push({ room, players });
            }
        }

        return games;
    },

    addPlayersToRoom(sockets: Socket<IClientEvents, IServerEvents>[] | RemoteSocket<IServerEvents, ISocketData>[], roomId: string) {
        const colors = GameRules.assignColors();
        const players: IPlayer[] = []
        sockets.forEach((socket, ind) => {
            players.push(new Player(socket.data.user.username, colors[ind], socket.data.user));
        })
        roomApi(roomId).updateRoomInfo({ players });
    },

    clearGameRoom(roomId: string) {
        boardApi(roomId).clearBoard();
        roomApi(roomId).clearRoom();
    }
}