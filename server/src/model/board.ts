import { IMove } from '../../../client/src/constants/socketIO/ClientEvents.interface';
import { Board, IBoard, IBoardStates } from '../../../client/src/model/Board';
import { FENs, Results } from '../../../client/src/model/helper.enum';


let ROOM_GAME_BOARDS = new Map();

export const boardApi = (roomId: string) => {

    const getBoard = () => {
        if (ROOM_GAME_BOARDS.has(roomId)) return getBoardData(ROOM_GAME_BOARDS.get(roomId));
        return createBoard();
    }

    const createBoard = () => {
        const board = new Board();
        board.startNewGame(FENs.INIT);
        board.updateAllLegalMoves();
        ROOM_GAME_BOARDS.set(roomId, board);
        return getBoardData(board);
    }

    const getResults = () => {
        const board: IBoard = ROOM_GAME_BOARDS.get(roomId);
        
        if (!board) return null;
        board.updateAllLegalMoves();
        if (board.isDraw()) return {
            result: Results.DRAW,
            currentPlayer: board.states.currentPlayer
        }
        if (board.isKingChecked()) {
            if (board.isCheckMate()) return {
                result: Results.CHECKMATE,
                currentPlayer: board.states.currentPlayer
            }
        }
    }

    const moveFigure = (move: IMove) => {
        const board: IBoard = ROOM_GAME_BOARDS.get(roomId);
        board.receiveMove(move);
        board.swapPlayer();
        ROOM_GAME_BOARDS.set(roomId, board);
    }    

    const getBoardData = (board:IBoard) => {
        const boardFEN = board.convertToFEN();
        const newBoardStates: IBoardStates = {...board.states}
        return {
            boardFEN,
            states: newBoardStates,

        };
    }

    return {
        getBoard,
        createBoard,
        moveFigure,
        getResults
    }

}