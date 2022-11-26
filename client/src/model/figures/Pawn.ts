import { IBoard } from "../Board";
import { ICell } from "../Cell";
import { Colors } from "../colors.enum";
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

    canMove(target: ICell, board: IBoard): boolean {
        if (!super.canMove(target, board)) return false;
        
        const direction = this.color === Colors.BLACK ? 1 : -1;
        const firstStepDirection = this.color === Colors.BLACK ? 2 : -2;
        

        if ((target.y === this.y + direction || this.isFirstMove && target.y === this.y + firstStepDirection)
            && target.x === this.x 
            && board.getCell(target.x, target.y).isEmpty()) {
                return true
            }

        if ((target.y === this.y + direction) 
            && (target.x === this.x-1 || target.x === this.x+1) 
            && board.getCell(this.x,this.y).isEnemy(target.figure)) {
                return true;
            }

        return false;
    }



    moveFigure(target: ICell): void {
        super.moveFigure(target);
        this.isFirstMove = false;
    }


}