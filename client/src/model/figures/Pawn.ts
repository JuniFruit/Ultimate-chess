import { IBoard } from "../Board";
import { ICell } from "../Cell";
import { Colors } from "../colors.enum";
import { Direction } from "../helper.enum";
import { isInBounds } from "../helpers";
import { Figure } from "./Figures";
import { FigureTypes, IFigure, ISpritesObj } from "./figures.interface";


export interface IPawn extends IFigure {
    isFirstMove: boolean;
    cellsAdvanced: number;
    lastMove: number; // on which global move count the move was made
    isEnPassant: boolean
    canEnPassant: (target: ICell, board: IBoard) => boolean;
    
}



export class Pawn extends Figure implements IPawn {
    readonly type;
    isFirstMove;
    cellsAdvanced = 0;
    lastMove = 0;
    isEnPassant;


    constructor(x: number, y: number, color: Colors, sprites?: ISpritesObj, isEnPassant: boolean = false) {
        super(x, y, color, sprites);
        this.sprite = color === Colors.BLACK ? sprites?.blackPawn : sprites?.whitePawn;
        this.type = FigureTypes.PAWN;
        this.isFirstMove = this.y === 1 || this.y === 6;
        this.isEnPassant = isEnPassant;
    }

    public moveFigure(target: ICell, board: IBoard, isFake?: boolean): void {

        const prevY = this.y;
        super.moveFigure(target, board, isFake);

        if (isFake) return;
        this.isFirstMove = false;
        this.cellsAdvanced += Math.abs(target.y - prevY);
        this.lastMove = board.states.globalMovesCount;
        this.isEnPassant = this.cellsAdvanced === 3;
    }

    public getLegalMoves(board: IBoard) {
        super.clearMoves()

        const direction = this.color === Colors.BLACK ? Direction.POS : Direction.NEG;
        const numCells = this.isFirstMove ? 2 : 1;

        super.getLegalMovesVertical({ board, direction, numCell: numCells });
        super.getLegalMovesDiagonal({ board, direction, numCell: 1 });
        this._addEnPassantMove(board);
        super.filterUncheckingMoves(board);

    }

    public addLegalMove(cell: ICell): boolean {    

        if (cell.isEmpty() && this.x === cell.x) {
            this.legalMoves.push(super.convertToLegalMove(cell))
            return false;
        } else if (cell.isEnemy(this) && this.x !== cell.x) {
            this.legalMoves.push(super.convertToLegalMove(cell));
            return true;
        }
        return true;
    }

    public canEnPassant(target: ICell, board: IBoard) {
        if (!this.isEnPassant) return false;
        if (!target.isEmpty()) return false;

        const dirX = target.x < this.x ? Direction.NEG : Direction.POS;

        const pawnToCapture = board.getCell(this.x + dirX, this.y).figure;
        if (pawnToCapture?.type !== FigureTypes.PAWN) return false;
        if (pawnToCapture.color === this.color) return false;
        if ((pawnToCapture as IPawn).cellsAdvanced !== 2 ||
            pawnToCapture.movesCount !== 1 ||
            (pawnToCapture as IPawn).lastMove !== board.states.globalMovesCount) return false;

        return true;
    }

    private _addEnPassantMove(board: IBoard) {

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