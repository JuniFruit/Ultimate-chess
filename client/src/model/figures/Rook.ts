import { IBoard } from "../Board";
import { ICell } from "../Cell";
import { Colors } from "../colors.enum";
import { Direction } from "../helper.enum";
import { Figure, FigureTypes, ISpritesObj } from "./Figures";


export class Rook extends Figure {
    readonly sprite?: string;
    readonly type: FigureTypes

    constructor(x: number, y: number, color: Colors, sprites?: ISpritesObj) {
        super(x, y, color, sprites);
        this.sprite = color === Colors.BLACK ? sprites?.blackRook : sprites?.whiteRook;
        this.type = FigureTypes.ROOK;
    }

    getLegalMoves(board: IBoard) {
        super.clearMoves()

        const myCell = board.getCell(this.x, this.y);
        myCell.getLegalMovesHorizontal({ board, numCell: 8 });
        myCell.getLegalMovesVertical({ board, numCell: 8 });

        super.filterUncheckingMoves(myCell, board);

    }
}