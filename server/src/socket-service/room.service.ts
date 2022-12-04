import { Socket } from 'socket.io';
import { GameRules } from '../model/gameRules'
import { boardApi } from '../model/board';
import { IClientEvents } from '../constants/socketIO/ClientEvents.interface';
import { IServerEvents, IStartData } from '../constants/socketIO/ServerEvents.interface';
import {Errors} from '../../../client/src/constants/constants';
import { IBoard } from '../../../client/src/model/Board';


export const RoomService = {

    async join(socket: Socket<IClientEvents, IServerEvents>, roomId: string) {
        socket.join(roomId);
    },

    // TODO send board instead creating every time, checking game state
    async onRoomJoin(sockets: Socket<IClientEvents, IServerEvents, any, IStartData>[], roomId: string) {
        // const currentBoard: IBoard = boardApi(roomId).getBoard();

        if (sockets.length < 2) return sockets[0].emit('noOpponent');
        if (sockets.length === 2) {
            this.setSocketsData(sockets, roomId);
            boardApi(roomId).createBoard();
            if (sockets[0].data.opponentUser?.username === sockets[1].data.opponentUser?.username) return sockets[0].emit('gameError', Errors.SAME_PLAYER)

            sockets.forEach(socket => socket.broadcast.emit('readyToStart', {
                color: socket.data.color,
                score: socket.data.score,
                user: socket.data.user,     
                opponentUser: socket.data.opponentUser          
            }));
        };
    },

    setSocketsData(sockets: Socket<IClientEvents, IServerEvents, any, IStartData>[], roomId: string) {
        sockets.forEach(socket => {
            socket.data.score = 0
            socket.data.room = roomId
        });
        const colors = GameRules.assignColors()
        sockets[0].data.color = colors[0];
        sockets[0].data.opponentUser = sockets[1].data.user;
        sockets[1].data.color = colors[1];
        sockets[1].data.opponentUser = sockets[0].data.user
    }
}