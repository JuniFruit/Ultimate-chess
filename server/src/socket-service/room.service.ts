import { Socket } from 'socket.io';
import { Colors } from '../../../client/src/model/colors.enum';
import { IOClientEvents } from '../constants/socketIO/ClientEvents.interface';
import { IOServerEvents, IStartPayload } from '../constants/socketIO/ServerEvents.interface';

export const RoomService = {

    async join(socket: Socket<IOClientEvents, IOServerEvents>, roomId: string) {
        socket.join(roomId);
    },

    async onRoomJoin(sockets: Socket<IOClientEvents, IOServerEvents, any, IStartPayload>[]) {
        if (sockets.length < 2) return sockets[0].emit('noOpponent');
        console.log(sockets.length);
        if (sockets.length === 2) {
            this.setSocketsData(sockets)
            sockets.forEach(socket => socket.broadcast.emit('readyToStart', {
                color: socket.data.color,
                score: socket.data.score,
                user: socket.data.user
            }));
        };
    },

    setSocketsData(sockets: Socket<IOClientEvents, IOServerEvents, any, IStartPayload>[]) {
        sockets.forEach(socket => socket.data.score = 0);
        sockets[0].data.color = Colors.BLACK;
        sockets[1].data.color = Colors.WHITE
    }
}