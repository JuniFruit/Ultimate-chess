import { Socket } from 'socket.io';
import { GameRules } from '../model/gameRules'
import { boardApi } from '../model/board';
import { IClientEvents } from '../constants/socketIO/ClientEvents.interface';
import { IServerEvents, IStartData } from '../constants/socketIO/ServerEvents.interface';


export const RoomService = {

    async join(socket: Socket<IClientEvents, IServerEvents>, roomId: string) {
        socket.join(roomId);
    },

    async onRoomJoin(sockets: Socket<IClientEvents, IServerEvents, any, IStartData>[], roomId: string) {
        if (sockets.length < 2) return sockets[0].emit('noOpponent');
        if (sockets.length === 2) {
            this.setSocketsData(sockets, roomId)

            sockets.forEach(socket => socket.broadcast.emit('readyToStart', {
                color: socket.data.color,
                score: socket.data.score,
                user: socket.data.user,
                board: boardApi(roomId).createBoard()
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
        sockets[1].data.color = colors[1];
    }
}