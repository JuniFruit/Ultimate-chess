import { IBoardUlt } from "./BoardUlt";
import { Cell, ICell } from "../Cell";
import { FigureTypes } from "../figures/figures.interface";
import { ISkillApplied, ISkillItem, SkillList, SkillNames } from "./Skills";
import { Colors } from "../colors.enum";


export interface ICellUltStates {
    skillsApplied: ISkillApplied[]
    prevSkillsApplied: ISkillApplied[]
}

export interface ICellUlt extends ICell {
    states: ICellUltStates;
    canPerformSkill: (skill: ISkillItem, board: IBoardUlt) => boolean;
    performSkill: (skill: SkillNames, board: IBoardUlt) => void;
    applySkill: (skill: ISkillItem, board: IBoardUlt) => void;
    clearExpiredStates: (board: IBoardUlt) => void;

}

export class CellUlt extends Cell implements ICellUlt {
    states: ICellUltStates = {
        skillsApplied: [],
        prevSkillsApplied: []
    }


    public canPerformSkill(skill: ISkillItem, board: IBoardUlt) {
        if (board.isSkillUsedByPlayer(skill.title)) return false;

        switch (skill.title) {
            case SkillNames.SACRIFICE:
                return this._canSacrifice(board);
            case SkillNames.LIGHTNING_BOLT:
                return this._canLightningBolt(board);
            case SkillNames.INCINERATE:
                return this._canSetOnFire();
            case SkillNames.PLAGUE:
                return this._canPlague(board);
            default:
                return false;
        }

    }

    public performSkill(skillTitle: SkillNames, board: IBoardUlt) {
        const skillItem = SkillList.find(item => item.title === skillTitle);

        if (!skillItem?.lasts) return this._performInstantSkill(skillTitle, board);

        this.applySkill(skillItem!, board)
    }


    private _performInstantSkill(skillTitle: SkillNames, board: IBoardUlt) {
        switch (skillTitle) {
            case SkillNames.SACRIFICE:
                return this._performSacrifice(board);
            default:
                return;
        }
    }

    private _performSacrifice(board: IBoardUlt) {
        board.popFigure(this.figure!);
        this.figure = null;
        this.prevFigure = null;
    }


    private _canSacrifice(board: IBoardUlt) {
        if (this.figure?.type !== FigureTypes.PAWN) return false;
        if (this.figure.color !== board.states.currentPlayer) return false;
        if (board.isLastStandingPiece(FigureTypes.PAWN, board.states.currentPlayer)) return false;
        return true;
    }

    private _canLightningBolt(board: IBoardUlt) {
        if (!this.figure) return false;
        if (this.figure.type === FigureTypes.KING) return false;
        if (this.figure.color === board.states.currentPlayer) return false;
        return true;
    }

    private _canSetOnFire() {
        if (this.figure || this._isOnFire()) return false;
        return true;
    }
    private _isOnFire() {
        return this.states.skillsApplied.some(skill => skill.title === SkillNames.INCINERATE)
    }


    private _canPlague(board: IBoardUlt) {
        if (this.figure?.type !== FigureTypes.PAWN) return false;
        const enemyColor = board.states.currentPlayer === Colors.WHITE ? Colors.BLACK : Colors.WHITE
        if (this.figure.color !== enemyColor) return false;
        if (board.isLastStandingPiece(FigureTypes.PAWN, enemyColor)) return false;
        return true
    }

    public isEmpty(): boolean {
        if (this._isOnFire()) return false;
        return super.isEmpty();
    }


    public applySkill(skill: ISkillItem, board: IBoardUlt) {
        const skillToApply: ISkillApplied = {
            ...skill,
            castBy: board.states.currentPlayer,
            expireAt: skill?.lasts ? board.states.globalMovesCount + skill.lasts : -1,
        }
        if (skill.canBeAppliedAt === 'figure') return this.figure?.applySkill(skillToApply);
        this.states.skillsApplied = [...this.states.skillsApplied, skillToApply];
    }

    public clearExpiredStates(board: IBoardUlt) {
        const currentGlobalMoveCount = board.states.globalMovesCount;

        if (this.figure) this.figure.clearExpiredStates(board);
        const skillToExpire = this.states.skillsApplied.find(skill => skill.expireAt === currentGlobalMoveCount);

        if (skillToExpire?.onExpire) this.performSkill(skillToExpire.onExpire, board)

        this.states.skillsApplied = this.states.skillsApplied.filter(skill => skill.expireAt !== currentGlobalMoveCount)
    }

}