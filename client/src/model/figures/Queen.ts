import { SPRITES } from "../../assets/sprites";
import { ICell } from "../Cell";
import { Colors } from "../colors.enum";
import { Figure, FigureTypes } from "./Figures";


export class Queen extends Figure {
    readonly sprite: string;
    readonly type: FigureTypes

    constructor(color: Colors, cell: ICell) {
        super(color, cell);
        this.sprite = color === Colors.BLACK ? SPRITES.blackQueen : SPRITES.whiteQueen;
        this.type = FigureTypes.QUEEN;
    }

    canMove(target: ICell): boolean {
        if (!super.canMove(target)) return false;

        if (this.cell.isEmptyDiagonal(target) || this.cell.isEmptyVertical(target) || this.cell.isEmptyHorizontal(target)) return true;

        return false;
    }

    moveFigure(target:ICell) {
        this.cell.figure = null;
        target.figure = this;
    }
}