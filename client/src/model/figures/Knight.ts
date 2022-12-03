import { IBoard } from "../Board";
import { Colors } from "../colors.enum";
import { Direction } from "../helper.enum";
import { isInBounds } from "../helpers";
import { Figure, FigureTypes, ISpritesObj } from "./Figures";


export class Knight extends Figure {
    readonly sprite?: string;
    readonly type: FigureTypes;


    constructor(x: number, y: number, color: Colors, sprites?: ISpritesObj) {
        super(x, y, color, sprites);
        this.sprite = color === Colors.BLACK ? sprites?.blackKnight : sprites?.whiteKnight;
        this.type = FigureTypes.KNIGHT;
    }    

    getLegalMoves(board: IBoard) {
        super.clearMoves()
        
        this.checkMoves(board, 1, 2, Direction.POS, Direction.POS)
        this.checkMoves(board, 2, 1, Direction.POS, Direction.POS)
        this.checkMoves(board, 1, 2, Direction.NEG, Direction.NEG)
        this.checkMoves(board, 2, 1, Direction.NEG, Direction.NEG)
        this.checkMoves(board, 1, 2, Direction.NEG, Direction.POS)
        this.checkMoves(board, 1, 2, Direction.POS, Direction.NEG)
        this.checkMoves(board, 2, 1, Direction.NEG, Direction.POS)
        this.checkMoves(board, 2, 1, Direction.POS, Direction.NEG)
        super.filterUncheckingMoves(board);

    }

    checkMoves(board: IBoard, rangeX: number, rangeY: number, dirX: Direction, dirY: Direction) {

        if (isInBounds(this.x - rangeX * dirX, this.y - rangeY * dirY)) {
            let current = board.getCell(this.x - rangeX * dirX, this.y - rangeY * dirY);
            super.addLegalMove(current);
        }


    }
}