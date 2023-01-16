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
    performDetonate: (board: IBoardUlt, isFake?: boolean) => void;
    canBless: (board: IBoardUlt) => boolean;
    canSacrifice: (board: IBoardUlt) => boolean;
    canLightningBolt: (board: IBoardUlt) => boolean;
    isOccupied: () => boolean;
    canPlague: (board: IBoardUlt) => boolean;

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
                return this.canSacrifice(board);
            case SkillNames.LIGHTNING_BOLT:
                return this.canLightningBolt(board);
            case SkillNames.INCINERATE:
                return !this.isOccupied();
            case SkillNames.PLAGUE:
                return this.canPlague(board);
            case SkillNames.SET_BOMB:
                return !this.isOccupied();
            case SkillNames.DETONATE:
                return true
            case SkillNames.BLESSING:
                return this.canBless(board);
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
        this.prevFigure.push(this.figure);
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
        const offsets = generateOffsets(1, 'square')

        offsets.forEach(offset => {
            const [x, y] = offset;
            if (!isInBounds(this.x + x, this.y + y)) return;
            const current = board.getCell(this.x + x, this.y + y)
            if (current.states.skillsApplied.some(skill => skill.title === SkillNames.INCINERATE)) current.prevFigure.pop();
            const lastPrevFigureCurrent = current.prevFigure.stack.head?.value;
            if (lastPrevFigureCurrent?.type === FigureTypes.PAWN) {
                current.figure = current.prevFigure.pop();
            }

        })
        const lastPrevFigure = this.prevFigure.stack.head?.value;
        if (!lastPrevFigure || lastPrevFigure?.type === FigureTypes.KING || lastPrevFigure?.type === FigureTypes.QUEEN) return;
        this.figure = this.prevFigure.pop();
    }

    public performKill(board: IBoardUlt, isFake = false) {
        if (!isFake) board.addLostFigure({ ...this.figure!, takenBy: getFigureInfo(this.figure!) })
        this.prevFigure.push(this.figure);
        this.figure = null;
    }


    public performDetonate(board: IBoardUlt, isFake = false) {
        const offsets = generateOffsets(1, 'square');

        if (this.figure
            && (this.figure.type !== FigureTypes.KING && this.figure.type !== FigureTypes.QUEEN)) this.performKill(board, isFake)


        offsets.forEach(offset => {
            const [x, y] = offset;
            if (!isInBounds(this.x + x, this.y + y)) return;
            const current = board.getCell(this.x + x, this.y + y);
            current.prevFigure.push(current.figure);
            if (current.figure && current.figure.type === FigureTypes.PAWN) current.performKill(board, isFake);
            const incinerate = SkillList.find(skill => skill.title === SkillNames.INCINERATE);
            if (!current.figure) current.applySkill(incinerate!, board);

        })
    }


    public canBless(board: IBoardUlt) {
        if (!this.figure || this.figure.color !== board.states.currentPlayer || this.figure.type !== FigureTypes.KNIGHT) return false;
        return true;
    }


    public canSacrifice(board: IBoardUlt) {
        if (this.figure?.type !== FigureTypes.PAWN) return false;
        if (this.figure.color !== board.states.currentPlayer) return false;
        if (board.isLastStandingPiece(FigureTypes.PAWN, board.states.currentPlayer)) return false;
        return true;
    }

    public canLightningBolt(board: IBoardUlt) {
        if (!this.figure) return false;
        if (this.figure.type === FigureTypes.KING) return false;
        if (this.figure.color === board.states.currentPlayer) return false;
        return true;
    }


    public isOccupied() {
        if (this.figure || this.states.skillsApplied.length) return true;
        return false;
    }

    public canPlague(board: IBoardUlt) {
        if (this.figure?.type !== FigureTypes.PAWN) return false;
        const enemyColor = board.states.currentPlayer === Colors.WHITE ? Colors.BLACK : Colors.WHITE
        if (this.figure.color !== enemyColor) return false;
        if (board.isLastStandingPiece(FigureTypes.PAWN, enemyColor)) return false;
        return true
    }

    private _isOnFire() {
        return this.states.skillsApplied.some(skill => skill.title === SkillNames.INCINERATE)
    }

    private _performInstantSkill(skillTitle: SkillNames, board: IBoardUlt, isFake = false) {
        switch (skillTitle) {
            case SkillNames.SACRIFICE:
                return this.performKill(board, isFake);
            case SkillNames.DETONATE:
                return this.performDetonate(board, isFake)
            default:
                return;
        }
    }

}

