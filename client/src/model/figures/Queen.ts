import { IBoard } from "../Board";
import { ICell } from "../Cell";
import { Colors } from "../colors.enum";
import { Figure, FigureTypes, ISpritesObj } from "./Figures";


export class Queen extends Figure {
    readonly sprite?: string;
    readonly type: FigureTypes;
    x: number;
    y: number;

    constructor(x:number, y:number,color: Colors, sprites?: ISpritesObj) {
        super(x,y,color,sprites);
        this.sprite = color === Colors.BLACK ? sprites?.blackQueen : sprites?.whiteQueen;
        this.x = x;
        this.y = y;
        this.type = FigureTypes.QUEEN;
    }

    canMove(target: ICell, board:IBoard): boolean {
        if (!super.canMove(target, board)) return false;

        if (board.cells[this.y][this.x].isEmptyDiagonal(target,board) || 
        board.cells[this.y][this.x].isEmptyVertical(target,board) || 
        board.cells[this.y][this.x].isEmptyHorizontal(target, board)) return true;

        return false;
    }

    
}