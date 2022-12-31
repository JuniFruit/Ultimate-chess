import { IMove } from '../../../client/src/constants/socketIO/ClientEvents.interface';
import { Board, IBoard } from '../../../client/src/model/Board';
import { BoardUlt, IBoardUlt } from '../../../client/src/model/ultimate/BoardUlt';
import { Colors } from '../../../client/src/model/colors.enum';
import { FENs, GameOverReasons, Results } from '../../../client/src/model/helper.enum';
import { getInitTime } from '../utils/utils';


const ROOM_GAME_BOARDS = new Map<string, IBoard | IBoardUlt>();

export const boardApi = (roomId: string) => {

    const isUltimate = roomId.includes('_ult');

    const getBoard = (): IBoard | IBoardUlt => {
        if (ROOM_GAME_BOARDS.has(roomId)) return ROOM_GAME_BOARDS.get(roomId)!;
        return createBoard();
    }

    const createBoard = (): IBoard | IBoardUlt => {
        const board: IBoard | IBoardUlt = isUltimate ? new BoardUlt() : new Board();

        board.startNewGame(FENs.INIT);
        board.getFigures();
        board.updateAllLegalMoves();
        board.states.whiteTime = getInitTime(roomId);
        board.states.blackTime = getInitTime(roomId);

        ROOM_GAME_BOARDS.set(roomId, board);
        return board
    }

    const getResults = () => {
        const board = getBoard()!;

        board.updateAllLegalMoves();
        if (board.isDraw()) return {
            result: Results.DRAW,
            loser: board.states.currentPlayer
        }
        if (board.isKingChecked()) {
            if (board.isCheckMate()) return {
                result: Results.CHECKMATE,
                loser: board.states.currentPlayer,
                reason: GameOverReasons.CHECKMATE
            }
        }
    }

    const moveFigure = (move: IMove) => {
        const board = getBoard();
        updateTime(board)
        board.receiveMove(move);
        board.states.isFirstMove = false;
        board.swapPlayer();
        ROOM_GAME_BOARDS.set(roomId, board);
    }

    const getBoardData = () => {
        const board = getBoard();
        updateTime(board);
        const boardFEN = board.convertToFEN();
        return {
            FEN: boardFEN,
            board
        };
    }

    const updateTime = (board: IBoard) => {
        const now = Date.now();
        if (!board.states.isFirstMove) {

            const timeElapsed = Math.floor((now - board.states.lastMoveTime!) / 1000);
            board.states.currentPlayer === Colors.BLACK ? board.states.blackTime! -= timeElapsed
                : board.states.whiteTime! -= timeElapsed;

        }
        board.states.lastMoveTime = now;
    }

    const getTime = () => {
        const board = getBoard();
        return { white: board.states.whiteTime, black: board.states.blackTime };
    }

    const isTimeout = (player: Colors) => {
        const board = getBoard();
        updateTime(board);
        const timer = player === Colors.BLACK ? 'blackTime' : 'whiteTime';
        return board.states[timer] <= 0;
    }

    const isSufficientMaterial = () => {
        const board = getBoard();
        board.updateAllLegalMoves();
        return board.isSufficientMaterial(board.states.currentPlayer === Colors.BLACK ? Colors.WHITE : Colors.BLACK); //checking enemy

    }

    const clearBoard = () => {
        ROOM_GAME_BOARDS.delete(roomId);
    }



    return {
        getBoard,
        createBoard,
        moveFigure,
        getResults,
        getBoardData,
        isSufficientMaterial,
        getTime,
        isTimeout,
        clearBoard
    }

}