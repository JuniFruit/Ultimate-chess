import { IBoard } from "../Board";
import { Colors } from "../colors.enum";
import { Figure } from "./Figures";
import { FigureTypes, IFigure, ISpritesObj } from "./figures.interface";



export class Bishop extends Figure {
    readonly type;


    constructor(x: number, y: number, color: Colors, sprites?: ISpritesObj) {
        super(x, y, color, sprites);

        this.spriteSrc = color === Colors.BLACK ? sprites?.blackBishop : sprites?.whiteBishop;
        this.type = FigureTypes.BISHOP;     
    }

    public getLegalMoves(board: IBoard) {
        super.clearMoves();
        super.getLegalMovesDiagonal({ board, numCell: 8 });
        super.filterUncheckingMoves(board);
    }
}