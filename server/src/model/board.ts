import { IMove } from '../../../client/src/constants/socketIO/ClientEvents.interface';
import { Board, IBoard, IBoardStates } from '../../../client/src/model/Board';
import { Colors } from '../../../client/src/model/colors.enum';
import { FENs, Results } from '../../../client/src/model/helper.enum';
import { getInitTime } from '../utils/utils';


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
        board.states.whiteTime = getInitTime(roomId);
        board.states.blackTime = getInitTime(roomId);

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
        updateTime(board)
        board.receiveMove(move);
        board.states.isFirstMove = false;
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

    const updateTime = (board: IBoard) => {
        const now = Date.now();
        if (!board.states.isFirstMove) {
            const timeElapsed = Math.floor((now - board.states.lastMoveTime!) / 1000);
            board.states.currentPlayer === Colors.BLACK ? board.states.blackTime!-= timeElapsed 
            : board.states.whiteTime!-= timeElapsed; 

        }
        board.states.lastMoveTime = now;         
    }

    const getTime = () => {
        const board: IBoard = ROOM_GAME_BOARDS.get(roomId);
        return {white: board.states.whiteTime, black: board.states.blackTime};
    }

    const isTimeout = (player: Colors) => {
        const board: IBoard = ROOM_GAME_BOARDS.get(roomId);
        updateTime(board);
        const timer = player === Colors.BLACK ? 'blackTime' : 'whiteTime';
        return board.states[timer] <= 0;
    }

    const isSufficientMaterial = () => {
        const board: IBoard = ROOM_GAME_BOARDS.get(roomId);
        board.updateAllLegalMoves();
        return board.isSufficientMaterial(board.states.currentPlayer === Colors.BLACK ? Colors.WHITE : Colors.BLACK); //checking enemy

    }

    const clearBoard = () =>{
        ROOM_GAME_BOARDS.delete(roomId);
    }

    return {
        getBoard,
        createBoard,
        moveFigure,
        getResults,
        isSufficientMaterial,
        getTime,
        isTimeout,
        clearBoard
    }

}