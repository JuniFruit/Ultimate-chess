import { IBoard } from "../Board";
import { ICell } from "../Cell";
import { Colors } from "../colors.enum";
import { Direction } from "../helper.enum";
import { isInBounds } from "../helpers";
import { FigureTypes, IFigure, IFigureBase, IFigureInfo, ILegalMoveArg, ISpritesObj } from "./figures.interface";



export class Figure implements IFigureBase {
    readonly color;   
    sprites;
    x;
    y;
    prevX;
    prevY;
    lastTake: IFigureInfo | null;
    takes: IFigureInfo[] = [];
    legalMoves: ICell[] = [];
    movesCount = 0;
    cellsAdvanced = 0;

    constructor(x: number, y: number, color: Colors, sprites?: ISpritesObj) {
        this.color = color;
        this.x = x;
        this.y = y;
        this.prevX = x;
        this.prevY = y;
        this.lastTake = null;
        this.sprites = sprites;
    }

    moveFigure(target: ICell, board: IBoard, isFake?: boolean) {
        this.prevX = this.x;
        this.prevY = this.y;
        
        this.x = target.x;
        this.y = target.y;

        if (target.figure) {
            this.lastTake = {...target.figure};
            this.takes.push({...target.figure});
        }


        if (isFake) return;
        this.movesCount ++;
    }

    filterUncheckingMoves(board: IBoard) {
        // if (!board.isCheck) return;
        if (this.color !== board.states.currentPlayer) return;
        this.legalMoves = [...this.legalMoves.filter(move => board.getCell(this.x, this.y).isUncheckingMove(move, board))]


    }
    /* 
        these legal moves getters are used to get potential moves in all directions. 
        If a figure has special conditions we can filter out these potential moves later in a figure class

        if direction is not specified, working in both directions 
     */

    getLegalMovesVertical({ board, direction, numCell }: ILegalMoveArg) {

        const dir = direction ? direction : Direction.POS;
        let i = 1;
        while (i <= numCell) {
            if (!isInBounds(this.x, this.y + i * dir)) break;
            const current = board.getCell(this.x, this.y + i * dir);
            const isLast = this.addLegalMove(current);
            if (isLast) break;
            i++;
        }

        if (!direction) this.getLegalMovesVertical({ board, direction: Direction.NEG, numCell });
    }
    getLegalMovesHorizontal({ board, direction, numCell }: ILegalMoveArg) {

        const dir = direction ? direction : Direction.POS;
        let i = 1;
        while (i <= numCell) {
            if (!isInBounds(this.x + i * dir, this.y)) break;
            const current = board.getCell(this.x + i * dir, this.y);
            const isLast = this.addLegalMove(current);
            if (isLast) break;
            i++;
        }

        if (!direction) this.getLegalMovesHorizontal({ board, direction: Direction.NEG, numCell });
    }

    getLegalMovesDiagonal({ board, direction, numCell }: ILegalMoveArg) {

        const dir = direction ? direction : Direction.POS;

        let currentInd = 1;
        while (currentInd <= numCell) {
            if (!isInBounds(this.x + currentInd * dir, this.y + currentInd * dir)) break;
            const current = board.getCell(this.x + currentInd * dir, this.y + currentInd * dir);
            const isLast = this.addLegalMove(current);
            if (isLast) break
            currentInd++;
        }
        currentInd = 1;

        while (currentInd <= numCell) {
            if (!isInBounds(this.x - currentInd * dir, this.y + currentInd * dir)) break;
            const current = board.getCell(this.x - currentInd * dir, this.y + currentInd * dir);
            const isLast = this.addLegalMove(current);
            if (isLast) break
            currentInd++;
        }

        if (!direction) this.getLegalMovesDiagonal({ board, direction: Direction.NEG, numCell });
    }


    addLegalMove(cell: ICell) {

        if (cell.isEmpty()) {
            this.legalMoves.push(cell);
            return false;

        } else if (!cell.isEmpty() && cell.isEnemy(this as unknown as IFigure)) {
            this.legalMoves.push(cell);
            return true;
        }
        return true;
    }

    clearMoves() {
        this.legalMoves = [];
    }
    getLegalMoves (board: IBoard) {

    } 

}