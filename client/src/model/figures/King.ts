import { SPRITES } from "../../assets/sprites";
import { ICell } from "../Cell";
import { Colors } from "../colors.enum";
import { Figure, FigureTypes } from "./Figures";


export class King extends Figure {
    readonly sprite: string;
    readonly type: FigureTypes

    constructor(color: Colors, cell: ICell) {
        super(color, cell);
        this.sprite = color === Colors.BLACK ? SPRITES.blackKing : SPRITES.whiteKing;
        this.type = FigureTypes.KING;
    }
    

    canMove(target: ICell): boolean {
        if (!super.canMove(target)) return false;
        const rangeX = Math.abs(target.x - this.cell.x);
        const rangeY = Math.abs(target.y - this.cell.y)
        if (rangeX > 1 || rangeY > 1) return false;
        if (this.isEnemyKingNear(target)) return false;
        if (!this.cell.isSafeCell(target)) return false;
        return true;
    }

    isEnemyKingNear(target: ICell) {

        if (this.isEnemyKing(target.board.cells[target.y][target.x + 1])) return true;
        if (this.isEnemyKing(target.board.cells[target.y][target.x - 1])) return true;
        if (!target.board.cells[target.y + 1] || !target.board.cells[target.y - 1]) return false
        if (this.isEnemyKing(target.board.cells[target.y + 1][target.x])) return true;
        if (this.isEnemyKing(target.board.cells[target.y - 1][target.x])) return true;
        if (this.isEnemyKing(target.board.cells[target.y + 1][target.x + 1])) return true;
        if (this.isEnemyKing(target.board.cells[target.y - 1][target.x - 1])) return true;
        if (this.isEnemyKing(target.board.cells[target.y + 1][target.x - 1])) return true;
        if (this.isEnemyKing(target.board.cells[target.y - 1][target.x + 1])) return true;

    }

    isEnemyKing(target: ICell): boolean {

        if (!target) return false;

        return target.figure?.type === FigureTypes.KING && target.figure.color !== this.color;
    }
}