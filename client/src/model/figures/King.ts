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
        return true;
    }
}