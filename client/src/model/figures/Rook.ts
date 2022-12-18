import { IBoard } from "../Board";
import { ICell } from "../Cell";
import { Colors } from "../colors.enum";
import { Figure } from "./Figures";
import { FigureTypes, IFigure, ISpritesObj } from "./figures.interface";

export interface IRook extends IFigure {
    isFirstMove?: boolean;
    performCastle: (board: IBoard) => void;
}



export class Rook extends Figure implements IRook {
    readonly sprite?;
    readonly type;
    isFirstMove

    constructor(x: number, y: number, color: Colors, sprites?: ISpritesObj, isFirstMove: boolean = true) {
        super(x, y, color, sprites);
        this.sprite = color === Colors.BLACK ? sprites?.blackRook : sprites?.whiteRook;
        this.type = FigureTypes.ROOK;
        this.isFirstMove = isFirstMove;
    }

    public getLegalMoves(board: IBoard) {
        super.clearMoves()
        super.getLegalMovesHorizontal({ board, numCell: 8 });
        super.getLegalMovesVertical({ board, numCell: 8 });

        super.filterUncheckingMoves(board);

    }

    public moveFigure(target: ICell, board: IBoard, isFake: boolean = false): void {
        super.moveFigure(target, board, isFake);

        if (isFake) return;

        this.isFirstMove = false;
    }

    public performCastle(board: IBoard) {
        
        const myCell = board.getCell(this.x, this.y);

        let moveValue = 0;
        if (this.x === 0) moveValue = 3;
        if (this.x === 7) moveValue = -2;
        const moveToCell = board.getCell(this.x + moveValue, this.y);

        myCell.moveFigure(moveToCell, board, {isCastling: true, isFake: false});

    }
}