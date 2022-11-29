import { IBoard } from "../Board";
import { ICell } from "../Cell";
import { Colors } from "../colors.enum";
import { isInBounds } from "../helpers";
import { Figure, FigureTypes, ISpritesObj } from "./Figures";


export class King extends Figure {
    readonly sprite?: string;
    readonly type: FigureTypes;

    constructor(x: number, y: number, color: Colors, sprites?: ISpritesObj) {
        super(x, y, color, sprites);
        this.sprite = color === Colors.BLACK ? sprites?.blackKing : sprites?.whiteKing;
        this.type = FigureTypes.KING;
    }

    getLegalMoves(board: IBoard) {
        super.clearMoves()

        const myCell = board.getCell(this.x, this.y);
        myCell.getLegalMovesHorizontal({ board, numCell: 1 });
        myCell.getLegalMovesVertical({ board, numCell: 1 });
        myCell.getLegalMovesDiagonal({ board, numCell: 1 });

        this.legalMoves = this.legalMoves.filter(cell => !this.isEnemyKingNear(cell, board))
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

    }

    isEnemyKing(target: ICell): boolean {

        if (!target) return false;

        return target.figure?.type === FigureTypes.KING && target.figure.color !== this.color;
    }
}