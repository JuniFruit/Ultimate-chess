import { Socket } from 'socket.io';
import { IMove } from '../../../client/src/constants/socketIO/ClientEvents.interface'
import { boardApi } from '../model/board';
import { IClientEvents } from '../constants/socketIO/ClientEvents.interface';
import { IServerEvents, IStartData } from '../constants/socketIO/ServerEvents.interface';
import { Errors } from '../../../client/src/constants/constants';
import { Results } from '../../../client/src/model/helper.enum';
import { UserService } from '../user/user.service';


export const BoardService = {
    handleMove(socket: Socket<IClientEvents, IServerEvents>, move: IMove) {
        try {
            const room = socket.data.room
            boardApi(room).moveFigure(move);
            socket.broadcast.emit("move", { ...move });
        } catch (error: any) {
            socket.emit('gameError', Errors.INTERNAL)
        }
    },

    async handleResults(socket: Socket<IClientEvents, IServerEvents, any, IStartData>, results: Results) {
        try {
            const user = await UserService.getById(socket.data.user?.id!);
            if (results === Results.LOSER) {
                socket.data.user!.winsCount!++;
                await UserService.increaseLoses(user.id);
            }
            if (results === Results.WINNER) await UserService.increaseWins(user.id);
        } catch (error) {

        }
    }
}