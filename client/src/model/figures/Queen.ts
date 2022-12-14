import { IBoard } from "../Board";
import { Colors } from "../colors.enum";
import { Figure } from "./Figures";
import { FigureTypes, IFigure, ISpritesObj } from "./figures.interface";


export class Queen extends Figure {
    readonly sprite?: string;
    readonly type: FigureTypes;


    constructor(x: number, y: number, color: Colors, sprites?: ISpritesObj) {
        super(x, y, color, sprites);
        this.sprite = color === Colors.BLACK ? sprites?.blackQueen : sprites?.whiteQueen;
        this.type = FigureTypes.QUEEN;
    }

    getLegalMoves(board: IBoard) {
        super.clearMoves()

        super.getLegalMovesDiagonal({ board, numCell: 8 });
        super.getLegalMovesHorizontal({ board, numCell: 8 });
        super.getLegalMovesVertical({ board, numCell: 8 });

        super.filterUncheckingMoves(board);

    }


}