import { Server, Socket } from 'socket.io';
import { IMove } from '../../../client/src/constants/socketIO/ClientEvents.interface'
import { boardApi } from '../model/board';
import { IClientEvents } from '../constants/socketIO/ClientEvents.interface';
import { IServerEvents } from '../constants/socketIO/ServerEvents.interface';
import { Results } from '../../../client/src/model/helper.enum';
import { Colors } from '../../../client/src/model/colors.enum';
import { RoomService } from './room.service';

export const BoardService = {
    handleMove(socket: Socket<IClientEvents, IServerEvents>, move: IMove, ioServer: Server<IClientEvents, IServerEvents>) {
        const room = socket.data.room
        boardApi(room).moveFigure(move);
        if (boardApi(room).isTimeout(socket.data.color)) return this.onTimeout(ioServer, socket);

        socket.broadcast.emit("move", {
            move: move,
            time: boardApi(room).getTime()
        });
    },

    checkResults(ioServer: Server<IClientEvents, IServerEvents>, roomId: string) {
        const results = boardApi(roomId).getResults();

        if (results) ioServer.in(roomId).emit('results', { ...results })
    },

    onTimeout(ioServer: Server<IClientEvents, IServerEvents>, socket: Socket<IClientEvents, IServerEvents>) {
        const roomId = socket.data.room;
        const currentPlayer = socket.data.color;

        if (!boardApi(roomId).isTimeout(currentPlayer)) {
            socket.emit("updateGame", RoomService.getUpdateGamePayload(socket, boardApi(roomId).getBoard()));
            return;
        }
        const isDraw = !boardApi(roomId).isSufficientMaterial(); //if enemy has insufficient material game is draw on timeout, else current p. loses

        if (isDraw) return ioServer.in(roomId).emit('results', {
            result: Results.DRAW,
            currentPlayer
        });
        return ioServer.in(roomId).emit("results", {
            result: Results.CHECKMATE,
            currentPlayer
        }
        )


    },

    

    onGameOver(roomId:string) {
        boardApi(roomId).clearBoard();
        RoomService.clearPlayers(roomId);
    }
}