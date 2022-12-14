import { IBoard } from "../Board";
import { ICell } from "../Cell";
import { Colors } from "../colors.enum";
import { Figure } from "./Figures";
import { FigureTypes, IFigure, ISpritesObj } from "./figures.interface";

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
        super.getLegalMovesHorizontal({ board, numCell: 8 });
        super.getLegalMovesVertical({ board, numCell: 8 });

        super.filterUncheckingMoves(board);

    }

    moveFigure(target: ICell, isFake:boolean = false): void {
        super.moveFigure(target);

        if (isFake) return;
        
        this.isFirstMove = false;
    }
}