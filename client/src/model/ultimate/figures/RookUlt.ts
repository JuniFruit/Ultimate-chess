
import { IBoard } from "../../Board";
import { Rook } from "../../figures/Rook";
import { IBoardUlt } from "../BoardUlt";



export class RookUlt extends Rook {
   


    // Now can move 1 cell diagonal and 4 cells both vertical and horizontal

    public getLegalMoves(board: IBoard | IBoardUlt) {
        super.clearMoves()
        super.getLegalMovesHorizontal({ board, numCell: 4 });
        super.getLegalMovesVertical({ board, numCell: 4 });
        super.getLegalMovesDiagonal({board, numCell: 1});
    }
   
   
}