import { IMove } from '../../../client/src/constants/socketIO/ClientEvents.interface';
import { Board, IBoard } from '../../../client/src/model/Board';


let ROOM_GAME_BOARDS = new Map();

export const boardApi = (roomId: string) => {

    const getBoard = () => {
        if (ROOM_GAME_BOARDS.has(roomId)) return ROOM_GAME_BOARDS.get(roomId);
    }

    const createBoard = () => {
        const board = new Board();
        
        board.startNewGame('rnbqkbnr/pppppppp/8/8/P1N1NP2/8/PP1PP1PP/R1BQKB1R');
        ROOM_GAME_BOARDS.set(roomId, board);
        return board;
    }

    const moveFigure = (move: IMove) => {
        const board: IBoard = ROOM_GAME_BOARDS.get(roomId);
        board.receiveMove(move);
        board.swapPlayer();
        board.updateAllLegalMoves();
        ROOM_GAME_BOARDS.set(roomId, board);
    }

    const isWinningMove = (move: IMove) => {
        const board: IBoard = ROOM_GAME_BOARDS.get(roomId);
        board.receiveMove(move);
        board.updateAllLegalMoves();
        if (board.isKingChecked()) {
            return board.isCheckMate();
        }
        return false
    }

    return {
        getBoard,
        createBoard,
        isWinningMove,
        moveFigure
    }

}