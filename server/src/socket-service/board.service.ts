import { Socket } from 'socket.io';
import { IMove } from '../../../client/src/constants/socketIO/ClientEvents.interface'
import { boardApi } from '../model/board';
import { IClientEvents } from '../constants/socketIO/ClientEvents.interface';
import { IServerEvents } from '../constants/socketIO/ServerEvents.interface';


export const BoardService = {
    handleMove(socket: Socket<IClientEvents, IServerEvents>, move: IMove) {
        const room = socket.data.room


        boardApi(room).moveFigure(move);
        socket.broadcast.emit("move", { ...move });


    }
}