import { IBoard } from "../Board";
import { ICell } from "../Cell";
import { Colors } from "../colors.enum";
import { Figure, FigureTypes, ISpritesObj } from "./Figures";




export class Pawn extends Figure {
    readonly sprite?: string;
    readonly type: FigureTypes;
    isFirstMove: boolean;
    x: number;
    y: number;

    constructor(x:number,y:number,color: Colors, sprites?: ISpritesObj) {
        super(x,y,color, sprites);
        this.sprite = color === Colors.BLACK ? sprites?.blackPawn : sprites?.whitePawn;
        this.x = x;
        this.y = y;
        this.type = FigureTypes.PAWN;
        this.isFirstMove = true;
    }

    canMove(target: ICell, board:IBoard,isUpwards = true): boolean {
        if (!super.canMove(target, board)) return false;
        const direction = isUpwards ? 1 : -1
        const rangeY = this.y - target.y; // we care about positive vertical values as we move only upwards
        const rangeX = Math.abs(this.x - target.x); // here our target can be on the left and right side 


        if ((((rangeY === 2 && rangeX === 0) && this.isFirstMove) && board.cells[this.y][this.x].isEmptyVertical(target, board)) ||
            ((rangeY === 1 && rangeX === 0 )&& !this.canAttack(target, board)) ||
            ((rangeY === direction && rangeX === 1) && this.canAttack(target, board))) return true

        return false;
    }

    canAttack(target: ICell, board:IBoard): boolean {
        if (!target.figure) return false;
        // if (this.cell.x === target.x) return false;
        return board.cells[this.y][this.x].isEnemy(target.figure);
    }

    moveFigure(target: ICell): void {
        super.moveFigure(target);
        this.isFirstMove = false;
    }


}