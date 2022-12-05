import { Server, Socket } from 'socket.io';
import { IMove } from '../../../client/src/constants/socketIO/ClientEvents.interface'
import { boardApi } from '../model/board';
import { IClientEvents } from '../constants/socketIO/ClientEvents.interface';
import { IServerEvents } from '../constants/socketIO/ServerEvents.interface';
import { Errors } from '../../../client/src/constants/constants';

export const BoardService = {
    handleMove(socket: Socket<IClientEvents, IServerEvents>, move: IMove) {
        try {
            const room = socket.data.room
            boardApi(room).moveFigure(move);
            socket.broadcast.emit("move", {
                move: move,
                time: boardApi(room).getTime()
            });
        } catch (error: any) {
            socket.emit('gameError', Errors.INTERNAL)
        }
    },   
    
    checkResults(ioServer: Server<IClientEvents,IServerEvents>, roomId:string) {
        const results = boardApi(roomId).getResults();

        if (results) {
            ioServer.in(roomId).emit('results', {...results})
        }
    },

    // onTimeout(ioServer: Server<IClientEvents,IServerEvents>, roomId:string, currentPlayer:Colors) {
    //     const isDraw = !boardApi(roomId).isSufficientMaterial(); //if enemy has insufficient material game is draw on timeout, else current p. loses
        
    //     if (isDraw) return ioServer.in(roomId).emit('results', {
    //         result: Results.DRAW,
    //         currentPlayer
    //     });
    //     return {
    //         result: Results.CHECKMATE,
    //         currentPlayer
    //     }

        
    // }
}