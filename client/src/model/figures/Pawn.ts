import { IBoard } from "../Board";
import { ICell } from "../Cell";
import { Colors } from "../colors.enum";
import { Direction } from "../helper.enum";
import { isInBounds } from "../helpers";
import { Figure, FigureTypes, IFigure, ISpritesObj } from "./Figures";


export interface IPawn extends IFigure {
    isFirstMove: boolean;   
}



export class Pawn extends Figure implements IPawn {
    readonly sprite?: string;
    readonly type: FigureTypes;
    isFirstMove: boolean;
   

    constructor(x: number, y: number, color: Colors, sprites?: ISpritesObj) {
        super(x, y, color, sprites);
        this.sprite = color === Colors.BLACK ? sprites?.blackPawn : sprites?.whitePawn;
        this.type = FigureTypes.PAWN;
        this.isFirstMove = this.y === 1 || this.y === 6;    
     
    }

    moveFigure(target: ICell): void {
        super.moveFigure(target);
        this.isFirstMove = this.y === 1 || this.y === 6;  
    }

    getLegalMoves(board: IBoard) {
        super.clearMoves()

        const direction = this.color === Colors.BLACK ? Direction.POS : Direction.NEG;
        const numCells = this.isFirstMove ? 2 : 1;    
        
        super.getLegalMovesVertical({board, direction, numCell: numCells});
        super.getLegalMovesDiagonal({board, direction, numCell: 1});      

        super.filterUncheckingMoves(board);

    }

    addLegalMove(cell: ICell): boolean {
        if (cell.isEmpty() && this.x === cell.x) {
            this.legalMoves.push(cell)
            return false;
        } else if (cell.isEnemy(this) && this.x !== cell.x) {
            this.legalMoves.push(cell);
            return true;
        }
        return true;
    }


}