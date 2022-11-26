import { IBoard } from "../Board";
import { ICell } from "../Cell";
import { Colors } from "../colors.enum";
import { Figure, FigureTypes, ISpritesObj } from "./Figures";


export class Rook extends Figure {
    readonly sprite?: string;
    readonly type: FigureTypes

    constructor(x: number, y: number, color: Colors, sprites?: ISpritesObj) {
        super(x, y, color, sprites);
        this.sprite = color === Colors.BLACK ? sprites?.blackRook : sprites?.whiteRook;     
        this.type = FigureTypes.ROOK;
    }

    canMove(target: ICell, board: IBoard): boolean {
        if (!super.canMove(target, board)) return false;

        if (board.getCell(this.x,this.y)!.isEmptyVertical(target, board) ||
            board.getCell(this.x,this.y)!.isEmptyHorizontal(target, board)) return true;

        return false;
    }
}