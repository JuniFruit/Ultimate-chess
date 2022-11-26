import { IBoard } from "../Board";
import { ICell } from "../Cell";
import { Colors } from "../colors.enum";
import { Figure, FigureTypes, ISpritesObj } from "./Figures";


export class Knight extends Figure {
    readonly sprite?: string;
    readonly type: FigureTypes;
    
    
    constructor(x:number, y:number, color: Colors, sprites?: ISpritesObj) {
        super(x,y,color, sprites);
        this.sprite = color === Colors.BLACK ? sprites?.blackKnight : sprites?.whiteKnight;      
        this.type = FigureTypes.KNIGHT;
    }

    canMove(target: ICell,board:IBoard): boolean {
        if (!super.canMove(target, board)) return false;
        if (target.x === this.x || target.y === this.y) return false;
        const rangeX = Math.abs(target.x - this.x);
        const rangeY = Math.abs(target.y - this.y);

        if (rangeX + rangeY === 3) return true;

        return false;
    }
}