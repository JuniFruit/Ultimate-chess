import { IBoard } from "../Board";
import { ICell } from "../Cell";
import { Colors } from "../colors.enum";
import { isInBounds } from "../helpers";
import { Figure, FigureTypes, IFigure, ISpritesObj } from "./Figures";


export interface IKing extends IFigure {
    isCastlingAvailable:boolean;
}

export class King extends Figure implements IKing {
    readonly sprite?: string;
    readonly type: FigureTypes;
    isCastlingAvailable:boolean;

    constructor(x: number, y: number, color: Colors, sprites?: ISpritesObj, isCastlingAvailable:boolean = true) {
        super(x, y, color, sprites);
        this.sprite = color === Colors.BLACK ? sprites?.blackKing : sprites?.whiteKing;
        this.type = FigureTypes.KING;
        this.isCastlingAvailable = isCastlingAvailable;
    }

    getLegalMoves(board: IBoard) {
        super.clearMoves()

        const myCell = board.getCell(this.x, this.y);
        myCell.getLegalMovesHorizontal({ board, numCell: 1 });
        myCell.getLegalMovesVertical({ board, numCell: 1 });
        myCell.getLegalMovesDiagonal({ board, numCell: 1 });
        this.legalMoves = this.legalMoves.filter(cell => !this.isEnemyKingNear(cell, board));
        super.filterUncheckingMoves(myCell, board);

    }

    isEnemyKingNear(target: ICell, board: IBoard) {

        if (this.isEnemyKing(board.getCell(target.x + 1, target.y))) return true;
        if (this.isEnemyKing(board.getCell(target.x - 1, target.y))) return true;
        if (isInBounds(target.x, target.y + 1)) {
            if (this.isEnemyKing(board.getCell(target.x + 1, target.y + 1))) return true;
            if (this.isEnemyKing(board.getCell(target.x, target.y + 1))) return true;
            if (this.isEnemyKing(board.getCell(target.x - 1, target.y + 1))) return true;
        }
        if (isInBounds(target.x, target.y - 1)) {
            if (this.isEnemyKing(board.getCell(target.x, target.y - 1))) return true;
            if (this.isEnemyKing(board.getCell(target.x - 1, target.y - 1))) return true;
            if (this.isEnemyKing(board.getCell(target.x + 1, target.y - 1))) return true;

        }
        return false;

    }

    isEnemyKing(target: ICell): boolean {

        if (!target) return false;

        return target.figure?.type === FigureTypes.KING && target.figure.color !== this.color;
    }

    moveFigure(target: ICell, isFake:boolean = false): void {
        super.moveFigure(target);

        if (isFake) return;

        this.isCastlingAvailable = false;
    }

    
}