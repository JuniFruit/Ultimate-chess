import { IBoard } from "../Board";
import { ICell } from "../Cell";
import { Colors } from "../colors.enum";
import { IBoardUlt } from "../ultimate/BoardUlt";
import { ICellUlt } from "../ultimate/CellUlt";
import { Figure } from "./Figures";
import { FigureTypes, IFigure, ISpritesObj } from "./figures.interface";

export interface IRook extends IFigure {
    isFirstMove?: boolean;
}



export class Rook extends Figure implements IRook {
    readonly type;
    isFirstMove

    constructor(x: number, y: number, color: Colors, sprites?: ISpritesObj, isFirstMove: boolean = true) {
        super(x, y, color, sprites);
        this.spriteSrc = color === Colors.BLACK ? sprites?.blackRook : sprites?.whiteRook;
        this.type = FigureTypes.ROOK;
        this.isFirstMove = isFirstMove;

    }

    public getLegalMoves(board: IBoard | IBoardUlt) {
        super.clearMoves()
        super.getLegalMovesHorizontal({ board, numCell: 8 });
        super.getLegalMovesVertical({ board, numCell: 8 });
    }

    public moveFigure(target: ICell | ICellUlt, board: IBoard | IBoardUlt, isFake: boolean = false): void {
        super.moveFigure(target, board, isFake);

        if (isFake) return;

        this.isFirstMove = false;
    }
    
}