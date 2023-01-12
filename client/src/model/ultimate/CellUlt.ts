import { IBoard } from "../Board";
import { Cell, ICell } from "../Cell";
import { Colors } from "../colors.enum";
import { FigureTypes } from "../figures/figures.interface";
import { generateOffsets, getFigureInfo, isInBounds } from "../helpers";
import { IBoardUlt } from "./BoardUlt";
import { ISkillApplied, ISkillItem, SkillList, SkillNames } from "./Skills";


export interface ICellUltStates {
    skillsApplied: ISkillApplied[]
    prevSkillsApplied: ISkillApplied[]
}

export interface ICellUlt extends ICell {
    states: ICellUltStates;
    canPerformSkill: (skill: ISkillItem, board: IBoardUlt) => boolean;
    performSkill: (skill: SkillNames, board: IBoardUlt, isFake?: boolean) => void;
    applySkill: (skill: ISkillItem, board: IBoardUlt, isFake?: boolean) => void;
    clearExpiredStates: (board: IBoardUlt, isFake?: boolean) => void;
    saveSkillsBeforeValidation: () => void;
    undoSkills: () => void;
    undoDetonate: (board: IBoardUlt) => void;
    performKill: (board: IBoardUlt, isFake?: boolean) => void 

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
            case SkillNames.SET_BOMB:
                return this._canSetBomb();
            case SkillNames.DETONATE:
                return true
            default:
                return false;
        }

    }

    public performSkill(skillTitle: SkillNames, board: IBoardUlt, isFake = false) {
        const skillItem = SkillList.find(item => item.title === skillTitle);

        if (!skillItem?.lasts) return this._performInstantSkill(skillTitle, board, isFake);

        this.applySkill(skillItem!, board)
    }


    public isEmpty(): boolean {
        if (this._isOnFire()) return false;
        return super.isEmpty();
    }



    public saveSkillsBeforeValidation() {
        this.states.prevSkillsApplied = [...this.states.skillsApplied];
        if (this.figure) this.figure.ultimateStates.prevSkillsApplied = [...this.figure.ultimateStates.skillsApplied];
    }

    public undoSkills() {
        this.states.skillsApplied = [...this.states.prevSkillsApplied]
        this.states.prevSkillsApplied = []
        if (this.figure) {
            this.figure.ultimateStates.skillsApplied = [...this.figure.ultimateStates.prevSkillsApplied];
            this.figure.ultimateStates.prevSkillsApplied = []
        }
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

    public clearExpiredStates(board: IBoardUlt, isFake = false) {
        const currentGlobalMoveCount = board.states.globalMovesCount;

        if (this.figure) this.figure.clearExpiredStates(board);
        const skillToExpire = this.states.skillsApplied.find(skill => skill.expireAt === currentGlobalMoveCount);

        if (skillToExpire?.onExpire) {
            this.performSkill(skillToExpire.onExpire, board, isFake)
            board.addUsedSkill(skillToExpire.onExpire, this);
        }

        this.states.skillsApplied = this.states.skillsApplied.filter(skill => skill.expireAt !== currentGlobalMoveCount)
    }   

    public undoDetonate(board: IBoardUlt) {
        const offsets = generateOffsets(1, 'square');
        this.figure = this.prevFigure;
        this.prevFigure = null;

        offsets.forEach(offset => {
            const [x, y] = offset;
            if (!isInBounds(this.x + x, this.y + y)) return;
            const current = board.getCell(this.x + x, this.y + y)
            if (current.prevFigure?.type !== FigureTypes.PAWN) return;
            current.figure = current.prevFigure
            current.prevFigure = null;
        })
    }

    public performKill(board: IBoardUlt, isFake = false) {
        if (!isFake) board.addLostFigure({ ...this.figure!, takenBy: getFigureInfo(this.figure!) })
        this.prevFigure = this.figure;
        this.figure = null;
    }


    private _performDetonate(board: IBoardUlt, isFake = false) {
        const offsets = generateOffsets(1, 'square');

        if (this.figure && (this.figure?.type !== FigureTypes.KING && this.figure?.type !== FigureTypes.QUEEN)) this.performKill(board, isFake)


        offsets.forEach(offset => {
            const [x, y] = offset;
            if (!isInBounds(this.x + x, this.y + y)) return;
            const current = board.getCell(this.x + x, this.y + y);
            
            if (current.figure?.type === FigureTypes.PAWN) current.performKill(board, isFake);
            const incinerate = SkillList.find(skill => skill.title === SkillNames.INCINERATE);
            if (current.canPerformSkill(incinerate!, board)) current.applySkill(incinerate!, board, isFake);

        })
    }

   


    private _performInstantSkill(skillTitle: SkillNames, board: IBoardUlt, isFake = false) {
        switch (skillTitle) {
            case SkillNames.SACRIFICE:
                return this.performKill(board, isFake);
            case SkillNames.DETONATE:
                return this._performDetonate(board, isFake)
            default:
                return;
        }
    }

    private _canSetBomb() {
        return this._canSetOnFire() // the same constraints
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

}

