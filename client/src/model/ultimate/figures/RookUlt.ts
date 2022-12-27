
import { IBoard } from "../../Board";
import { ICell } from "../../Cell";
import { IFigure } from "../../figures/figures.interface";
import { Rook } from "../../figures/Rook";
import { IBoardUlt } from "../BoardUlt";
import { ICellUlt } from "../CellUlt";



export class RookUlt extends Rook {

    ultimateStates = {
        skillsApplied: []
    }


    // Now can move 1 cell diagonal and 4 cells both vertical and horizontal

    public getLegalMoves(board: IBoard | IBoardUlt) {
        super.clearMoves()
        super.getLegalMovesHorizontal({ board, numCell: 4 });
        super.getLegalMovesVertical({ board, numCell: 4 });
        super.getLegalMovesDiagonal({board, numCell: 1});
    }
   
   
}