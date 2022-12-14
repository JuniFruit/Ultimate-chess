import { IBoard } from "../Board";
import { ICell } from "../Cell";
import { Colors } from "../colors.enum";
import { Direction } from "../helper.enum";
import { generateOffsets, isInBounds } from "../helpers";
import { IBoardUlt } from "../ultimate/BoardUlt";
import { ICellUlt } from "../ultimate/CellUlt";
import { Figure } from "./Figures";
import { FigureTypes, IFigure, IFigureStates, ILegalMove, ISpritesObj } from "./figures.interface";
import { IRook } from "./Rook";


export interface IKingStates extends IFigureStates {
    isCastlingAvailable: boolean;

}

export interface IKing extends IFigure {
    states: IKingStates;
    canPerformCastle: (target: ICell, board: IBoard) => boolean;
}

export class King extends Figure implements IKing {
    readonly type;
    states: IKingStates = {
        ...this.states,
        isCastlingAvailable: true,
    };

    constructor(x: number, y: number, color: Colors, sprites?: ISpritesObj, isCastlingAvailable: boolean = true) {
        super(x, y, color, sprites);
        this.spriteSrc = color === Colors.BLACK ? sprites?.blackKing : sprites?.whiteKing;
        this.type = FigureTypes.KING;
        this.states.isCastlingAvailable = isCastlingAvailable;
    }

    public getLegalMoves(board: IBoard | IBoardUlt) {
        super.clearMoves()
        super.getLegalMovesHorizontal({ board, numCell: 1 });
        super.getLegalMovesVertical({ board, numCell: 1 });
        super.getLegalMovesDiagonal({ board, numCell: 1 });
        this.legalMoves = this.legalMoves.filter(move => !this._isEnemyKingNear(move, board));

    }

    private _isEnemyKingNear(target: ILegalMove, board: IBoard | IBoardUlt) {

        const offsets = generateOffsets(1, 'square');
        return offsets.some(offset => {
            const [x, y] = offset;
            if (isInBounds(target.x + x, target.y + y)) {
                return this._isEnemyKing(board.getCell(target.x + x, target.y + y))
            }
            return false
        })

    }

    private _isEnemyKing(target: ICell | ICellUlt): boolean {

        if (!target) return false;

        return target.figure?.type === FigureTypes.KING && target.figure.color !== this.color;
    }

    public moveFigure(target: ICell | ICellUlt, board: IBoard | IBoardUlt, isFake?: boolean) {
        super.moveFigure(target, board, isFake);

        if (isFake) return;

        this.states.isCastlingAvailable = false;
    }

    public canPerformCastle(target: ICell | ICellUlt, board: IBoard | IBoardUlt) {
        // check if none of the pieces moved and they are on the same row
        if (!this.states.isCastlingAvailable || target.figure?.type !== FigureTypes.ROOK) return false;
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
   

}