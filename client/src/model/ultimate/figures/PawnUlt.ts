import { IBoard } from "../../Board";
import { ICell } from "../../Cell";
import { Pawn } from "../../figures/Pawn";
import { IBoardUlt } from "../BoardUlt";
import { ICellUlt } from "../CellUlt";


export class PawnUlt extends Pawn {

    ultimateStates = {
        skillsApplied: []
    }

    public getLegalMoves(board: IBoard): void {
        super.getLegalMoves(board);
        
    }

    //Pawn can take forward  and go diagonal now

    public addLegalMove(cell: ICell | ICellUlt): boolean {

        if (cell.isEmpty() || cell.isEnemy(this)) {
            this.legalMoves.push(super.convertToLegalMove(cell))
            return false;
        }

        return true;
    }


    // En passant is disabled in Ultimate mode

    public canEnPassant(target: ICell | ICellUlt, board: IBoard | IBoardUlt): boolean {
        return false
    }

}