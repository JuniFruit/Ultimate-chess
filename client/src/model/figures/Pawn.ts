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

    constructor(x: number, y: number, color: Colors, sprites?: ISpritesObj) {
        super(x, y, color, sprites);
        this.sprite = color === Colors.BLACK ? sprites?.blackPawn : sprites?.whitePawn;
        this.type = FigureTypes.PAWN;
        this.isFirstMove = true;
    }

    moveFigure(target: ICell): void {
        super.moveFigure(target);
        this.isFirstMove = false;
    }

    getLegalMoves(board: IBoard) {
        super.clearMoves()

        const direction = this.color === Colors.BLACK ? Direction.POS : Direction.NEG;
        const numCells = this.isFirstMove ? 2 : 1;

        const myCell = board.getCell(this.x, this.y);

        for (let i = 1; i<=numCells; i++) {
            if (isInBounds(this.x, this.y + direction*i)) {
                const nextCell = board.getCell(this.x, this.y +direction*i);
                nextCell.isEmpty() && this.legalMoves.push(nextCell);
            }
        }
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