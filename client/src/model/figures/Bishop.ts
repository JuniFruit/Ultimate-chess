import { IBoard } from "../Board";
import { Colors } from "../colors.enum";
import { Figure, FigureTypes, ISpritesObj } from "./Figures";


//TODO add dynamic moving capacity

export class Bishop extends Figure {
    readonly sprite?: string;
    readonly type: FigureTypes
  
    
    constructor(x:number,y:number,color: Colors, sprites?: ISpritesObj) {
        super(x,y,color, sprites);
      
        this.sprite = color === Colors.BLACK ? sprites?.blackBishop : sprites?.whiteBishop;
        this.type = FigureTypes.BISHOP;
    }    

    getLegalMoves(board:IBoard) {
        super.clearMoves()

        const myCell = board.getCell(this.x, this.y);
        myCell.getLegalMovesDiagonal({board, numCell: 8});
        super.filterUncheckingMoves(myCell, board);
    }
}