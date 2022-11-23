import { SPRITES } from "../../assets/sprites";
import { ICell } from "../Cell";
import { Colors } from "../colors.enum";
import { Figure, FigureTypes } from "./Figures";




export class Pawn extends Figure {
    readonly sprite: string;
    readonly type: FigureTypes;
    isFirstMove: boolean;

    constructor(color: Colors, cell: ICell) {
        super(color, cell);
        this.sprite = color === Colors.BLACK ? SPRITES.blackPawn : SPRITES.whitePawn;
        this.type = FigureTypes.PAWN;
        this.isFirstMove = true;
    }

    canMove(target: ICell, isUpwards = true): boolean {
        if (!super.canMove(target)) return false;
        const direction = isUpwards ? 1 : -1
        const rangeY = this.cell.y - target.y; // we care about positive vertical values as we move only upwards
        const rangeX = Math.abs(this.cell.x - target.x); // here our target can be on the left and right side 


        if ((((rangeY === 2 && rangeX === 0) && this.isFirstMove) && this.cell.isEmptyVertical(target)) ||
            ((rangeY === 1 && rangeX === 0 )&& !this.canAttack(target)) ||
            ((rangeY === direction && rangeX === 1) && this.canAttack(target))) return true

        return false;
    }

    canAttack(target: ICell): boolean {
        if (!target.figure) return false;
        // if (this.cell.x === target.x) return false;
        return this.cell.isEnemy(target.figure);
    }

    moveFigure(target: ICell): void {
        super.moveFigure(target);
        this.isFirstMove = false;
    }


}