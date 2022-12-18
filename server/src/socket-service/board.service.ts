import { RemoteSocket, Server, Socket } from 'socket.io';
import { IMove } from '../../../client/src/constants/socketIO/ClientEvents.interface'
import { boardApi } from '../model/board';
import { IClientEvents } from '../constants/socketIO/ClientEvents.interface';
import { IServerEvents, ISocketDataServer } from '../constants/socketIO/ServerEvents.interface';
import { GameOverReasons, Results } from '../../../client/src/model/helper.enum';
import { Requests } from '../../../client/src/constants/constants';
import { Colors } from '../../../client/src/model/colors.enum';
import { IGameData, IResultPayload } from '../../../client/src/constants/socketIO/ServerEvents.interface';
import { UserService } from '../user/user.service';
import { roomApi } from '../model/room';

export const BoardService = {
    handleMove(socket: Socket<IClientEvents, IServerEvents>, move: IMove, ioServer: Server<IClientEvents, IServerEvents>) {
        const roomId = socket.data.room
        boardApi(roomId).moveFigure(move);
        if (boardApi(roomId).isTimeout(socket.data.color)) return this.onTimeout(ioServer, socket);

        socket.to([roomId, `${roomId}_obs`]).emit("move", move);
        socket.to([roomId, `${roomId}_obs`]).emit("updateTimer", boardApi(roomId).getTime());
    },

    checkResults(ioServer: Server<IClientEvents, IServerEvents>, roomId: string) {
        const results = boardApi(roomId).getResults();

        if (results) {
            ioServer.to([roomId, `${roomId}_obs`]).emit('results', { ...results })
            this.recordResults(ioServer, results, roomId);
        }
    },

    onTimeout(ioServer: Server<IClientEvents, IServerEvents>, socket: Socket<IClientEvents, IServerEvents>) {


        const roomId = socket.data.room;
        const loser = roomApi(roomId).getPlayer(socket.data.user.username)?.color;

        if (!loser) return;

        if (!boardApi(roomId).isTimeout(loser)) {
            socket.to([roomId, `${roomId}_obs`]).emit("updateTimer", boardApi(roomId).getTime());
            return;
        }
        const isDraw = !boardApi(roomId).isSufficientMaterial(); //if enemy has insufficient material game is draw on timeout, else current p. loses

        const results = {
            result: Results.CHECKMATE,
            loser,
            reason: GameOverReasons.TIMEOUT
        }

        if (isDraw) return ioServer.to([roomId, `${roomId}_obs`]).emit('results', { ...results, result: Results.DRAW });

        ioServer.to([roomId, `${roomId}_obs`]).emit("results", results);
        this.recordResults(ioServer, results, roomId);
    },
    async onConfirmRequest(ioServer: Server<IClientEvents, IServerEvents>, payload: Requests, roomId: string) {

        if (payload === Requests.DRAW) {
            const results = {
                result: Results.DRAW,
                loser: Colors.BLACK
            }
            this.onGameOver(roomId, results);
            return ioServer.to([roomId, `${roomId}_obs`]).emit("results", results);
        }

        if (payload === Requests.REMATCH) {
            const sockets = await ioServer.in([roomId, `${roomId}_obs`]).fetchSockets();
            sockets.forEach(socket => socket.emit("updateGame", this.getUpdateGamePayload(socket, roomId)));

            roomApi(roomId).updateRoomInfo({ result: null });
        }

    },

    onResign(ioServer: Server<IClientEvents, IServerEvents>, roomId: string, username: string) {

        const loser = roomApi(roomId).getPlayer(username)?.color;
        if (!loser) return;

        const results = {
            result: Results.CHECKMATE,
            loser,
            reason: GameOverReasons.RESIGN
        }

        ioServer.to([roomId, `${roomId}_obs`]).emit("results", results);
        this.recordResults(ioServer, results, roomId);
    },

    async recordResults(ioServer: Server<IClientEvents, IServerEvents>, results: IResultPayload, roomId: string) {

        this.onGameOver(roomId, results);

        if (results.result === Results.DRAW) return;
        const sockets = await ioServer.in(roomId).fetchSockets();
        if (!sockets.length) return;

        const players = roomApi(roomId).getRoomInfo().players;

        if (!players) return;

        const users = [{ user: players[0].user, color: players[0].color }, { user: players[1].user, color: players[1].color }];

        users.forEach(async (user) => {
            try {
                
                const isAuthed = user.user?.id && user.user?.id !== 0
                if (user.color === results.loser) {
                    isAuthed && await UserService.increaseLoses(user.user.id);
                    user.user.lossesCount++;
                } else {
                    isAuthed && await UserService.increaseWins(user.user.id);
                    user.user.winsCount++;
                };

            } catch (error) {
                console.log(error);
            }
        })

    },

    onGlobalUpdate(sockets: RemoteSocket<IServerEvents, ISocketDataServer>[]) {

        sockets.forEach(socket => socket.emit('updateGame', this.getUpdateGamePayload(socket, socket.data.room!)));
    },

    getUpdateGamePayload(socket: RemoteSocket<IServerEvents, ISocketDataServer> | Socket<IClientEvents, IServerEvents>,
        roomId: string): IGameData {

        const boardData = boardApi(roomId).getBoardData();
        const players = roomApi(roomId).getRoomInfo().players;
        const isObserver = socket.data.room.includes('_obs');

        let playerOne = players![0];
        let playerTwo = players![1]

        if (!isObserver) {
            playerOne = players?.find(player => player.username === socket.data.user.username)!;
            playerTwo = players?.find(player => player.username !== playerOne?.username)!;
        }

        return {
            playerOne: playerOne?.user!,
            playerTwo: playerTwo?.user!,
            myColor: playerOne?.color!,
            boardData,
            isObserver
        }

    },


    onGameOver(roomId: string, results: IResultPayload) {
        boardApi(roomId).createBoard();
        roomApi(roomId).updateRoomInfo({ result: results });
    }
}