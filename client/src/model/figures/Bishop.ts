import { SPRITES } from "../../assets/sprites";
import { ICell } from "../Cell";
import { Colors } from "../colors.enum";
import { Figure, FigureTypes } from "./Figures";


export class Bishop extends Figure {
    readonly sprite: string;
    readonly type: FigureTypes

    constructor(color: Colors, cell: ICell) {
        super(color, cell);
        this.sprite = color === Colors.BLACK ? SPRITES.blackBishop : SPRITES.whiteBishop;
        this.type = FigureTypes.BISHOP;
    }

    canMove(target: ICell): boolean {
        if (!super.canMove(target)) return false;

        if (this.cell.isEmptyDiagonal(target)) return true;

        return false;
    }
}