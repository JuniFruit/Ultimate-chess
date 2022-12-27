import { IBoardUlt } from "./BoardUlt";
import { Cell, ICell } from "../Cell";
import { FigureTypes } from "../figures/figures.interface";
import { SkillNames } from "./Skills";


export interface ICellUltStates {
    isOnFire: boolean

}

export interface ICellUlt extends ICell {
    states: ICellUltStates;
    canPerformSkill: (skill: SkillNames, board: IBoardUlt) => boolean;
    performSkill: (skill: SkillNames, board: IBoardUlt) => void;
    performSacrifice: (board: IBoardUlt) => void;
    isOnFire: () => boolean

}

export class CellUlt extends Cell implements ICellUlt {
    states: ICellUltStates = {
        isOnFire: false
    }


    public canPerformSkill(skill: SkillNames, board: IBoardUlt) {
        switch (skill) {
            case SkillNames.SACRIFICE:
                return this._canSacrifice(board);
            case SkillNames.LIGHTNING_BOLT:
                return this._canLightningBolt(board);
            default:
                return false;
        }
    }

    public performSkill(skill: SkillNames, board: IBoardUlt) {
        switch (skill) {
            case SkillNames.SACRIFICE:
                board.addUsedSkill(skill, this)
                this.performSacrifice(board);
            break;
            case SkillNames.LIGHTNING_BOLT:
                board.addUsedSkill(skill, this);
                this.performDisable(board)
            break;
            default:
                return;
        }
    }

    public performSacrifice(board: IBoardUlt) {
        board.popFigure(this.figure!);
        this.figure = null;
        this.prevFigure = null;
    }

    public performDisable(board:IBoardUlt) {
        this.figure?.applySkill(SkillNames.LIGHTNING_BOLT, board.states.currentPlayer,board.states.globalMovesCount);
    }

    private _canSacrifice(board: IBoardUlt) {
        if (this.figure?.type !== FigureTypes.PAWN) return false;
        if (this.figure.color !== board.states.currentPlayer) return false;
        if (board.isSkillUsedByPlayer(SkillNames.SACRIFICE)) return false;
        if (board.figures.filter(figure => figure.type === FigureTypes.PAWN
            && figure.color === board.states.currentPlayer).length < 2) return false;
        return true;
    }

    private _canLightningBolt(board: IBoardUlt) {
        if (this.figure?.type === FigureTypes.KING) return false;
        if (this.figure?.color === board.states.currentPlayer) return false;
        if (board.isSkillUsedByPlayer(SkillNames.LIGHTNING_BOLT)) return false // Temporary solution
        return true;
    }

    private _canSetOnFire() {
        if (this.figure || this.states.isOnFire) return false;
    }

    public isOnFire() {
        return this.states.isOnFire
    }




}