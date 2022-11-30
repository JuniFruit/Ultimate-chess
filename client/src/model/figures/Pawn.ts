import { IBoard } from "../Board";
import { ICell } from "../Cell";
import { Colors } from "../colors.enum";
import { Direction } from "../helper.enum";
import { isInBounds } from "../helpers";
import { Figure, FigureTypes, ISpritesObj } from "./Figures";




export class Pawn extends Figure {
    readonly sprite?: string;
    readonly type: FigureTypes;
    isFirstMove: boolean;
    isPromotion: boolean;

    constructor(x: number, y: number, color: Colors, sprites?: ISpritesObj) {
        super(x, y, color, sprites);
        this.sprite = color === Colors.BLACK ? sprites?.blackPawn : sprites?.whitePawn;
        this.type = FigureTypes.PAWN;
        this.isFirstMove = true;
        this.isPromotion = false;
    }

    moveFigure(target: ICell): void {
        super.moveFigure(target);
        this.isFirstMove = this.y === 1 || this.y === 6;
        this.isPromotion = this.y === 0 || this.y === 7;
    }

    getLegalMoves(board: IBoard) {
        super.clearMoves()

        const direction = this.color === Colors.BLACK ? Direction.POS : Direction.NEG;
        const numCells = this.isFirstMove ? 2 : 1;

        const myCell = board.getCell(this.x, this.y);
        
        myCell.getLegalMovesVertical({board, direction, numCell: numCells});
        this.legalMoves = this.legalMoves.filter(move => !myCell.isEnemy(move.figure))

        if (isInBounds(this.x + 1, this.y + direction*1)) {
            const rightDiagonalCell = board.getCell(this.x + 1, this.y + direction * 1)
            rightDiagonalCell.isEnemy(this) && this.legalMoves.push(rightDiagonalCell) 

        }
        if (isInBounds(this.x -1, this.y + direction*1)) {
            const leftDiagonalCell = board.getCell(this.x - 1, this.y + direction * 1);
            leftDiagonalCell.isEnemy(this) && this.legalMoves.push(leftDiagonalCell)

        }

        super.filterUncheckingMoves(myCell, board);

    }


}