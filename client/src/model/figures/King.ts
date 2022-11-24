import { IBoard } from "../Board";
import { ICell } from "../Cell";
import { Colors } from "../colors.enum";
import { Figure, FigureTypes, ISpritesObj } from "./Figures";


export class King extends Figure {
    readonly sprite?: string;
    readonly type: FigureTypes;
    x: number;
    y: number;

    constructor(x:number, y:number,color: Colors, sprites?: ISpritesObj) {
        super(x,y,color, sprites);
        this.sprite = color === Colors.BLACK ? sprites?.blackKing : sprites?.whiteKing;
        this.x = x;
        this.y = y;
        this.type = FigureTypes.KING;
    }
    

    canMove(target: ICell, board:IBoard): boolean {
        if (!super.canMove(target, board)) return false;
        const rangeX = Math.abs(target.x - this.x);
        const rangeY = Math.abs(target.y - this.y)
        if (rangeX > 1 || rangeY > 1) return false;
        // if (this.isEnemyKingNear(target)) return false;
        if (!board.cells[this.y][this.x].isSafeCell(target, board)) return false;
        return true;
    }

    // isEnemyKingNear(target: ICell) {

    //     if (this.isEnemyKing(target.board.cells[target.y][target.x + 1])) return true;
    //     if (this.isEnemyKing(target.board.cells[target.y][target.x - 1])) return true;
    //     if (!target.board.cells[target.y + 1] || !target.board.cells[target.y - 1]) return false
    //     if (this.isEnemyKing(target.board.cells[target.y + 1][target.x])) return true;
    //     if (this.isEnemyKing(target.board.cells[target.y - 1][target.x])) return true;
    //     if (this.isEnemyKing(target.board.cells[target.y + 1][target.x + 1])) return true;
    //     if (this.isEnemyKing(target.board.cells[target.y - 1][target.x - 1])) return true;
    //     if (this.isEnemyKing(target.board.cells[target.y + 1][target.x - 1])) return true;
    //     if (this.isEnemyKing(target.board.cells[target.y - 1][target.x + 1])) return true;

    // }

    isEnemyKing(target: ICell): boolean {

        if (!target) return false;

        return target.figure?.type === FigureTypes.KING && target.figure.color !== this.color;
    }
}