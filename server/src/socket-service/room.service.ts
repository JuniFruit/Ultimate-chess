import { Socket } from 'socket.io';
import { EMIT_EVENTS } from '../constants/emitEvents';
import { Colors } from '../../../client/src/model/colors.enum';

export const RoomService = {

    async join(socket: Socket, roomId: string) {
        socket.join(roomId);
    },

    async onRoomJoin(sockets: Socket[]) {
        if (sockets.length < 2) return sockets[0].emit(EMIT_EVENTS.NO_OPPONENT);
        if (sockets.length === 2) {
            this.setSocketsData(sockets)
            sockets.forEach(socket => socket.emit(EMIT_EVENTS.READY_TO_START, {
                color: socket.data.color,
                score :socket.data.score
            }));
        };
    },

    setSocketsData(sockets: Socket[]) {
        sockets.forEach(socket => socket.data.score = 0);
        sockets[0].data.color = Colors.BLACK;
        sockets[1].data.color = Colors.WHITE
    }
}