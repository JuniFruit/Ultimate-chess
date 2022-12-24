import { IBoard } from "../Board";
import { ICell } from "../Cell";
import { Colors } from "../colors.enum";
import { Direction } from "../helper.enum";
import { isInBounds } from "../helpers";
import { Figure } from "./Figures";
import { FigureTypes, IFigure, ILegalMove, ISpritesObj } from "./figures.interface";
import { IRook } from "./Rook";


export interface IKing extends IFigure {
    isCastlingAvailable:boolean;
    canPerformCastle: (target: ICell, board: IBoard) => boolean;
    getCastleTarget: (target: ICell, board: IBoard) => ICell;
}

export class King extends Figure implements IKing {
    readonly type;
    isCastlingAvailable;

    constructor(x: number, y: number, color: Colors, sprites?: ISpritesObj, isCastlingAvailable:boolean = true) {
        super(x, y, color, sprites);
        this.spriteSrc = color === Colors.BLACK ? sprites?.blackKing : sprites?.whiteKing;
        this.type = FigureTypes.KING;
        this.isCastlingAvailable = isCastlingAvailable;     
    }

    public getLegalMoves(board: IBoard) {
        super.clearMoves()
        super.getLegalMovesHorizontal({ board, numCell: 1 });
        super.getLegalMovesVertical({ board, numCell: 1 });
        super.getLegalMovesDiagonal({ board, numCell: 1 });
        this.legalMoves = this.legalMoves.filter(move => !this._isEnemyKingNear(move, board));
        super.filterUncheckingMoves(board);

    }

    private _isEnemyKingNear(target: ILegalMove, board: IBoard) {

        if (this._isEnemyKing(board.getCell(target.x + 1, target.y))) return true;
        if (this._isEnemyKing(board.getCell(target.x - 1, target.y))) return true;
        if (isInBounds(target.x, target.y + 1)) {
            if (this._isEnemyKing(board.getCell(target.x + 1, target.y + 1))) return true;
            if (this._isEnemyKing(board.getCell(target.x, target.y + 1))) return true;
            if (this._isEnemyKing(board.getCell(target.x - 1, target.y + 1))) return true;
        }
        if (isInBounds(target.x, target.y - 1)) {
            if (this._isEnemyKing(board.getCell(target.x, target.y - 1))) return true;
            if (this._isEnemyKing(board.getCell(target.x - 1, target.y - 1))) return true;
            if (this._isEnemyKing(board.getCell(target.x + 1, target.y - 1))) return true;

        }
        return false;

    }

    private _isEnemyKing(target: ICell): boolean {

        if (!target) return false;

        return target.figure?.type === FigureTypes.KING && target.figure.color !== this.color;
    }

    public moveFigure(target: ICell, board: IBoard, isFake?: boolean) {
        super.moveFigure(target, board, isFake);

        if (isFake) return;

        this.isCastlingAvailable = false;
    }

    public canPerformCastle(target: ICell, board: IBoard) {
        // check if none of the pieces moved and they are on the same row
        if (!this.isCastlingAvailable || target.figure?.type !== FigureTypes.ROOK) return false;
        if (this.color !== target.figure.color) return false;
        if (board.states.isCheck) return false;
        if (this.y !== target.y) return false;
        if (!(target.figure as IRook).isFirstMove) return false;

        // check if no pieces between
        const dir = target.x < this.x ? Direction.NEG : Direction.POS;

        for (let i = 1; i < 3; i++) {
            if (!board.getCell(this.x + i * dir, this.y).isEmpty() 
            || board.getCell(this.x + i * dir, this.y).isUnderAttack(board)) return false;
        }      

        return true;
    }

    public getCastleTarget(target: ICell, board: IBoard) {
        const dir = target.x < this.x ? Direction.NEG : Direction.POS;
        const moveToCell = board.getCell(this.x + 2 * dir, this.y);
        
        return moveToCell;

    }

    
}