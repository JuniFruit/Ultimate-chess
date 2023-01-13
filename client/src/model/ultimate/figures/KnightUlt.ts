import { IBoard } from "../../Board";
import { ICell } from "../../Cell";
import { Knight } from "../../figures/Knight";
import { IBoardUlt } from "../BoardUlt";
import { SkillNames } from "../Skills";



export class KnightUlt extends Knight {


    public moveFigure(target: ICell, board: IBoard, isFake?: boolean | undefined): void {
        super.moveFigure(target, board, isFake);

        if (!isFake) this.ultimateStates.skillsApplied = this.ultimateStates.skillsApplied.filter(
            skill => skill.title !== SkillNames.BLESSING);
    }

    public getLegalMoves(board: IBoard | IBoardUlt, offsetsRange = 1): void {
        if (this.ultimateStates.skillsApplied.some(
            skill => skill.title === SkillNames.BLESSING)) return super.getLegalMoves(board, 2);
        
        return super.getLegalMoves(board, offsetsRange);
    }
}
