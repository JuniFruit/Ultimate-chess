import { IBoard } from "../Board";
import { ICell } from "../Cell";
import { Colors } from "../colors.enum";
import { Direction } from "../helper.enum";
import { isInBounds } from "../helpers";
import { IBoardUlt } from "../ultimate/BoardUlt";
import { ICellUlt } from "../ultimate/CellUlt";
import { Figure } from "./Figures";
import { FigureTypes, IFigure, IFigureStates, ISpritesObj } from "./figures.interface";

export interface IPawnStates extends IFigureStates {
    isFirstMove: boolean;
    cellsAdvanced: number;
    lastMove: number; // on which global move count the move was made
    isEnPassant: boolean
}


export interface IPawn extends IFigure {
    states: IPawnStates
    canEnPassant: (target: ICell, board: IBoard | IBoardUlt) => boolean;

}



export class Pawn extends Figure implements IPawn {
    readonly type;
    states: IPawnStates = {
        ...this.states,
        isFirstMove: true,
        cellsAdvanced: 0,
        lastMove: 0,
        isEnPassant: false
    }
    


    constructor(x: number, y: number, color: Colors, sprites?: ISpritesObj) {
        super(x, y, color, sprites);
        this.spriteSrc = color === Colors.BLACK ? sprites?.blackPawn : sprites?.whitePawn;
        this.type = FigureTypes.PAWN;
        this.states.isFirstMove = this.y === 1 || this.y === 6;        
    }

    public moveFigure(target: ICell | ICellUlt, board: IBoard | IBoardUlt, isFake?: boolean): void {

        const prevY = this.y;
        super.moveFigure(target, board, isFake);

        if (isFake) return;
        this.states.isFirstMove = false;
        this.states.cellsAdvanced += Math.abs(target.y - prevY);
        this.states.lastMove = board.states.globalMovesCount;
        this.states.isEnPassant = this.states.cellsAdvanced === 3;
    }

    public getLegalMoves(board: IBoard | IBoardUlt) {
        super.clearMoves()

        const direction = this.color === Colors.BLACK ? Direction.POS : Direction.NEG;
        const numCells = this.states.isFirstMove ? 2 : 1;

        super.getLegalMovesVertical({ board, direction, numCell: numCells });
        super.getLegalMovesDiagonal({ board, direction, numCell: 1 });
        this._addEnPassantMove(board);

    }

    public addLegalMove(cell: ICell | ICellUlt): boolean {

        if (cell.isEmpty() && this.x === cell.x) {
            this.legalMoves.push(super.convertToLegalMove(cell))
            return false;
        } else if (cell.isEnemy(this) && this.x !== cell.x) {
            this.legalMoves.push(super.convertToLegalMove(cell));
            return true;
        }
        return true;
    }

    public canEnPassant(target: ICell | ICellUlt, board: IBoard | IBoardUlt) {
        if (!this.states.isEnPassant) return false;
        if (!target.isEmpty()) return false;

        const dirX = target.x < this.x ? Direction.NEG : Direction.POS;

        const pawnToCapture = board.getCell(this.x + dirX, this.y).figure;
        if (pawnToCapture?.type !== FigureTypes.PAWN) return false;
        if (pawnToCapture.color === this.color) return false;
        if ((pawnToCapture as IPawn).states.cellsAdvanced !== 2 ||
            pawnToCapture.states.movesCount !== 1 ||
            (pawnToCapture as IPawn).states.lastMove !== board.states.globalMovesCount) return false;

        return true;
    }

    private _addEnPassantMove(board: IBoard | IBoardUlt) {

        const dirY = this.color === Colors.BLACK ? Direction.POS : Direction.NEG;
        if (isInBounds(this.x + 1, this.y + dirY)) {
            const targetRight = board.getCell(this.x + 1, this.y + dirY);
            if (this.canEnPassant(targetRight, board)) this.legalMoves.push(super.convertToLegalMove(targetRight));
        }
        if (isInBounds(this.x - 1, this.y + dirY)) {
            const targetLeft = board.getCell(this.x - 1, this.y + dirY);
            if (this.canEnPassant(targetLeft, board)) this.legalMoves.push(super.convertToLegalMove(targetLeft));
        }
    }


}