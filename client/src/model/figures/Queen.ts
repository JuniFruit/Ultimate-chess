import { IBoard } from "../Board";
import { Colors } from "../colors.enum";
import { IBoardUlt } from "../ultimate/BoardUlt";
import { Figure } from "./Figures";
import { FigureTypes, ISpritesObj } from "./figures.interface";


export class Queen extends Figure {
    readonly type;


    constructor(x: number, y: number, color: Colors, sprites?: ISpritesObj) {
        super(x, y, color, sprites);
        this.spriteSrc = color === Colors.BLACK ? sprites?.blackQueen : sprites?.whiteQueen;
        this.type = FigureTypes.QUEEN;   

    }

    public getLegalMoves(board: IBoard | IBoardUlt) {
        super.clearMoves()

        super.getLegalMovesDiagonal({ board, numCell: 8 });
        super.getLegalMovesHorizontal({ board, numCell: 8 });
        super.getLegalMovesVertical({ board, numCell: 8 });


    }


}