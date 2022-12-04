import { RemoteSocket, Socket } from 'socket.io';
import { GameRules } from '../model/gameRules'
import { boardApi } from '../model/board';
import { IClientEvents } from '../constants/socketIO/ClientEvents.interface';
import { IServerEvents, IStartData } from '../constants/socketIO/ServerEvents.interface';
import {Errors} from '../../../client/src/constants/constants';


export const RoomService = {

    async join(socket: Socket<IClientEvents, IServerEvents>, roomId: string) {
        socket.data.room = roomId
        socket.join(roomId);
    },

    // TODO send board instead creating every time, checking game state
    async onRoomJoin(sockets: RemoteSocket<IServerEvents, IStartData>[], roomId: string) {

        const currentBoard = boardApi(roomId).getBoard();
        if (sockets.length < 2) return sockets[0].emit('noOpponent');
        if (sockets.length === 2) {
            this.setSocketsData(sockets);

            if (sockets[0].data.opponentUser?.username === sockets[1].data.opponentUser?.username) return sockets[0].emit('gameError', Errors.SAME_PLAYER)

            sockets.forEach(socket => socket.emit('readyToStart', {
                color: socket.data.color,
                score: socket.data.score,
                user: socket.data.user,     
                opponentUser: socket.data.opponentUser,
                boardData: currentBoard    
            }));
        };
    },

    setSocketsData(sockets: RemoteSocket<IServerEvents, IStartData>[]) {
        sockets.forEach(socket => {
            socket.data.score = 0
        });
        const colors = GameRules.assignColors()
        sockets[0].data.color = colors[0];
        sockets[0].data.opponentUser = sockets[1].data.user;
        sockets[1].data.color = colors[1];
        sockets[1].data.opponentUser = sockets[0].data.user
    }
}