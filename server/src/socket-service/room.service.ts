import { RemoteSocket, Socket } from 'socket.io';
import { GameRules } from '../model/gameRules'
import { boardApi } from '../model/board';
import { IClientEvents } from '../constants/socketIO/ClientEvents.interface';
import { IServerEvents, IStartData } from '../constants/socketIO/ServerEvents.interface';
import { Errors } from '../../../client/src/constants/constants';
import { IPlayer, Player } from '../../../client/src/model/Player';
import { IBoard } from '../../../client/src/model/Board';
import { IBoardData } from '../../../client/src/constants/socketIO/ServerEvents.interface';

const ROOM_INFO = new Map()

export const RoomService = {

    async join(socket: Socket<IClientEvents, IServerEvents>, roomId: string) {
        socket.data.room = roomId
        socket.join(roomId);
    },

    // TODO send board instead creating every time, checking game state
    async onRoomJoin(sockets: RemoteSocket<IServerEvents, IStartData>[], roomId: string) {

        const currentBoard = boardApi(roomId).getBoard();
        if (sockets.length === 2 && currentBoard.states.isFirstMove) {
            
            if (sockets[0].data.user?.username === sockets[1].data.user?.username) return sockets[0].emit('gameError', Errors.SAME_PLAYER)
            
            this.setSocketsData(sockets);
            sockets.forEach(socket => socket.emit('updateGame', this.getUpdateGamePayload(socket, currentBoard)));
        };
        if (sockets.length === 2 && !currentBoard.states.isFirstMove) {
            const players: IPlayer[] = ROOM_INFO.get(sockets[1].data.room);
            const myInfo = players.find(player => player.username === sockets[1].data.user?.username);
            if (myInfo) sockets[1].emit("updateGame", this.getUpdateGamePayload(sockets[1], currentBoard));
        }
    },

    setSocketsData(sockets: RemoteSocket<IServerEvents, IStartData>[]) {
        const players: IPlayer[] = []

        const colors = GameRules.assignColors()
        sockets[0].data.color = colors[0];
        sockets[0].data.opponentUser = sockets[1].data.user;
        sockets[1].data.color = colors[1];
        sockets[1].data.opponentUser = sockets[0].data.user;

        sockets.forEach(socket => {
            socket.data.score = 0
            players.push(new Player(socket.data.user?.username!, socket.data.color!, socket.data.score));
        });
        ROOM_INFO.set(sockets[0].data.room, players);
    },

    getUpdateGamePayload(socket: RemoteSocket<IServerEvents, IStartData> | Socket<IClientEvents, IServerEvents>, board: IBoardData) {
        return {
            color: socket.data.color,
            score: socket.data.score,
            user: socket.data.user,
            opponentUser: socket.data.opponentUser,
            boardData: board
        }
    },

    clearPlayers(room:string) {
        ROOM_INFO.set(room, []);
    }


}