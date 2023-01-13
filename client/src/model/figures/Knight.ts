import { IBoard } from "../Board";
import { Colors } from "../colors.enum";
import { generateOffsets, isInBounds } from "../helpers";
import { IBoardUlt } from "../ultimate/BoardUlt";
import { Figure } from "./Figures";
import { FigureTypes, IFigure, ISpritesObj } from "./figures.interface";

export interface IKnight extends IFigure {
    getLegalMoves: (board: IBoard | IBoardUlt, offsetsRange?:number) => void;
}


export class Knight extends Figure {
    readonly type;


    constructor(x: number, y: number, color: Colors, sprites?: ISpritesObj) {
        super(x, y, color, sprites);
        this.spriteSrc = color === Colors.BLACK ? sprites?.blackKnight : sprites?.whiteKnight;
        this.type = FigureTypes.KNIGHT;
    }

    public getLegalMoves(board: IBoard | IBoardUlt, offsetsRange = 1) {
        super.clearMoves()
              
        const offsets = generateOffsets(offsetsRange, 'knight');
        offsets.forEach(offset => {
            const [x, y] = offset;
            if (isInBounds(this.x + x, this.y + y)) {
                super.addLegalMove(board.getCell(this.x + x, this.y + y))
            }
        })
    }
}