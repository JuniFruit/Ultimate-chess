import { SPRITES } from "../../assets/sprites";
import { ICell } from "../Cell";
import { Colors } from "../colors.enum";
import { Figure, FigureTypes } from "./Figures";


export class Knight extends Figure {
    readonly sprite: string;
    readonly type: FigureTypes;

    
    constructor(color: Colors, cell: ICell) {
        super(color, cell);
        this.sprite = color === Colors.BLACK ? SPRITES.blackKnight : SPRITES.whiteKnight;
        this.type = FigureTypes.KNIGHT;
    }

    canMove(target: ICell): boolean {
        if (!super.canMove(target)) return false;
        if (target.x === this.cell.x || target.y === this.cell.y) return false;
        const rangeX = Math.abs(target.x - this.cell.x);
        const rangeY = Math.abs(target.y - this.cell.y);

        if (rangeX + rangeY === 3) return true;

        return false;
    }
}