import { IBoard } from "../Board";
import { ICell } from "../Cell";
import { Colors } from "../colors.enum";
import { Direction } from "../helper.enum";
import { Figure, FigureTypes, IFigure, ISpritesObj } from "./Figures";

export interface IRook extends IFigure {
    isFirstMove?:boolean;
}



export class Rook extends Figure implements IRook {
    readonly sprite?: string;
    readonly type: FigureTypes;
    isFirstMove: boolean;

    constructor(x: number, y: number, color: Colors, sprites?: ISpritesObj, isFirstMove: boolean = true) {
        super(x, y, color, sprites);
        this.sprite = color === Colors.BLACK ? sprites?.blackRook : sprites?.whiteRook;
        this.type = FigureTypes.ROOK;
        this.isFirstMove = isFirstMove;
    }

    getLegalMoves(board: IBoard) {
        super.clearMoves()

        const myCell = board.getCell(this.x, this.y);
        myCell.getLegalMovesHorizontal({ board, numCell: 8 });
        myCell.getLegalMovesVertical({ board, numCell: 8 });

        super.filterUncheckingMoves(myCell, board);

    }

    moveFigure(target: ICell, isFake:boolean = false): void {
        super.moveFigure(target);

        if (isFake) return;
        
        this.isFirstMove = false;
    }
}