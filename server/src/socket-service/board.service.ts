import { RemoteSocket, Server, Socket } from 'socket.io';
import { IMove } from '../../../client/src/constants/socketIO/ClientEvents.interface'
import { boardApi } from '../model/board';
import { IClientEvents } from '../constants/socketIO/ClientEvents.interface';
import { IServerEvents, IStartData } from '../constants/socketIO/ServerEvents.interface';
import { Results } from '../../../client/src/model/helper.enum';
import { Requests } from '../../../client/src/constants/constants';
import { Colors } from '../../../client/src/model/colors.enum';
import { IResultPayload } from '../../../client/src/constants/socketIO/ServerEvents.interface';
import { UserService } from '../user/user.service';
import { IPlayer, Player } from '../../../client/src/model/Player';
import { GameRules } from '../model/gameRules';
import { roomApi } from '../model/room';

export const BoardService = {
    handleMove(socket: Socket<IClientEvents, IServerEvents>, move: IMove, ioServer: Server<IClientEvents, IServerEvents>) {
        const roomId = socket.data.room
        boardApi(roomId).moveFigure(move);
        if (boardApi(roomId).isTimeout(socket.data.color)) return this.onTimeout(ioServer, socket);

        socket.to(roomId).emit("move", {
            move: move,
            time: boardApi(roomId).getTime()
        });
    },

    checkResults(ioServer: Server<IClientEvents, IServerEvents>, roomId: string) {
        const results = boardApi(roomId).getResults();

        if (results) {
            ioServer.in(roomId).emit('results', { ...results })
            this.recordResults(ioServer, results, roomId);
        }
    },

    onTimeout(ioServer: Server<IClientEvents, IServerEvents>, socket: Socket<IClientEvents, IServerEvents>) {
        const roomId = socket.data.room;
        const loser = socket.data.color;

        if (!boardApi(roomId).isTimeout(loser)) {
            socket.emit("updateGame", this.getUpdateGamePayload(socket, roomId));
            return;
        }
        const isDraw = !boardApi(roomId).isSufficientMaterial(); //if enemy has insufficient material game is draw on timeout, else current p. loses

        const results = {
            result: Results.CHECKMATE,
            loser
        }

        if (isDraw) return ioServer.in(roomId).emit('results', { ...results, result: Results.DRAW });

        ioServer.in(roomId).emit("results", results);
        this.recordResults(ioServer, results, roomId);
    },
    async onConfirmRequest(ioServer: Server<IClientEvents, IServerEvents>, payload: Requests, roomId: string) {

        if (payload === Requests.DRAW) {    
            const results = {
                result: Results.DRAW,
                loser: Colors.BLACK
            }
            this.onGameOver(roomId, results);
            return ioServer.in(roomId).emit("results", results);
        }

        if (payload === Requests.REMATCH) {
            const sockets = await ioServer.in(roomId).fetchSockets()
            sockets.forEach(socket => socket.emit("updateGame", this.getUpdateGamePayload(socket, roomId)));
            roomApi(roomId).updateRoomInfo({result: null});

        }

    },

    onResign(ioServer: Server<IClientEvents, IServerEvents>, room: string, player: Colors) {
        const results = {
            result: Results.CHECKMATE,
            loser: player
        }

        ioServer.in(room).emit("results", results);
        this.recordResults(ioServer, results, room);
    },

    async recordResults(ioServer: Server<IClientEvents, IServerEvents>, results: IResultPayload, room: string) {

        this.onGameOver(room, results);

        if (results.result === Results.DRAW) return;
        const sockets = await ioServer.in(room).fetchSockets();
        if (!sockets.length) return;

        const socket = sockets[0]; //one socket is enough as it has information about its counterpart in data object

        const users = [{ user: socket.data.opponentUser, color: socket.data.color === Colors.WHITE ? Colors.BLACK : Colors.WHITE },
        { user: socket.data.user, color: socket.data.color }];

        users.forEach(async (user) => {
            try {
                if (!user.user?.id || user.user?.id === 0) return;
                if (user.color === results.loser) {
                    return await UserService.increaseLoses(user.user.id)
                } else {
                    return await UserService.increaseWins(user.user.id);
                };

            } catch (error) {
                console.log(error);
            }
        })

    },

    onGlobalUpdate(sockets: RemoteSocket<IServerEvents, IStartData>[]) {
        this.setSocketsData(sockets);
        sockets.forEach(socket => socket.emit('updateGame', this.getUpdateGamePayload(socket, socket.data.room!)));
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
            players.push(new Player(socket.data.user?.username!,
                socket.data.color!, socket.data.score, socket.data.user!, socket.data.opponentUser!));
        });

        roomApi(sockets[0].data.room!).updateRoomInfo({ players });

    },

    getUpdateGamePayload(socket: RemoteSocket<IServerEvents, IStartData> | Socket<IClientEvents, IServerEvents>, roomId: string) {
        const board = boardApi(roomId).getBoard();
        return {
            color: socket.data.color,
            score: socket.data.score,
            user: socket.data.user,
            opponentUser: socket.data.opponentUser,
            boardData: board
        }
    },


    onGameOver(roomId: string, results: IResultPayload) {
        boardApi(roomId).createBoard();
        roomApi(roomId).updateRoomInfo({ result: results });
    }
}