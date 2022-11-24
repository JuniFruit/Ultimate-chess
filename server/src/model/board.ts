import { Board } from '../../../client/src/model/Board';
import { ICell } from '../../../client/src/model/Cell';
import { Colors } from '../../../client/src/model/colors.enum';

let ROOM_GAME_BOARDS = new Map();

export const boardApi = (roomId: string) => {

    const getBoard = () => {
        if (ROOM_GAME_BOARDS.has(roomId)) return ROOM_GAME_BOARDS.get(roomId);
    }

    const createBoard = (color1:Colors, color2:Colors) => {
        const board = new Board();
        
        board.startNewGame();
        board.initFigures(color1, color2);
        ROOM_GAME_BOARDS.set(roomId, board);
        return board;
    }

    const moveFigure = (currentCell:ICell, targetCell:ICell) => {
        const board = ROOM_GAME_BOARDS.get(roomId);
        board.receiveMove(currentCell, targetCell);
    }

    return {
        getBoard,
        createBoard,
        moveFigure
    }

}