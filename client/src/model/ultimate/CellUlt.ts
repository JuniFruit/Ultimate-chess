import { IBoardUlt } from "./BoardUlt";
import { Cell, ICell } from "../Cell";
import { FigureTypes } from "../figures/figures.interface";
import { ISkillApplied, ISkillItem, SkillList, SkillNames } from "./Skills";
import { Colors } from "../colors.enum";
import { IVFX, IVFXConstructor, VFX } from "../effects/VFX";
import { IEffectItem } from "../effects/data/effects.data";


export interface ICellUltStates {
    skillsApplied: ISkillApplied[]
    effects: IVFX[];
}

export interface ICellUlt extends ICell {
    states: ICellUltStates;
    canPerformSkill: (skill: ISkillItem, board: IBoardUlt) => boolean;
    performSkill: (skill: SkillNames, board: IBoardUlt) => void;
    applySkill: (skill: ISkillItem, castBy: Colors, currentGlobalMovesCount: number) => void;
    clearExpiredStates: (currentGlobalMoveCount: number) => void;
    setEffect: (args: IEffectItem) => void;
    updateEffect: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, isFlipped: boolean) => void;
    clearEffects: () => void;

}

export class CellUlt extends Cell implements ICellUlt {
    states: ICellUltStates = {
        skillsApplied: [],
        effects: []
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
            default:
                return false;
        }

    }

    public performSkill(skillTitle: SkillNames, board: IBoardUlt) {
        board.addUsedSkill(skillTitle, this)
        const skillItem = SkillList.find(item => item.title === skillTitle);

        if (!skillItem?.lasts) return this._performInstantSkill(skillTitle, board);

        this.applySkill(skillItem!, board.states.currentPlayer, board.states.globalMovesCount)
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
        if (board.figures.filter(figure => figure.type === FigureTypes.PAWN
            && figure.color === board.states.currentPlayer).length < 2) return false;
        return true;
    }

    private _canLightningBolt(board: IBoardUlt) {
        if (this.figure?.type === FigureTypes.KING) return false;
        if (this.figure?.color === board.states.currentPlayer) return false;
        return true;
    }

    private _canSetOnFire() {
        if (this.figure || this._isOnFire()) return false;
        return true;
    }
    private _isOnFire() {
        return this.states.skillsApplied.some(skill => skill.title === SkillNames.INCINERATE)
    }


    public isEmpty(): boolean {
        if (this._isOnFire()) return false;
        return super.isEmpty();
    }


    public applySkill(skill: ISkillItem, castBy: Colors, currentGlobalMovesCount: number) {
        const skillToApply: ISkillApplied = {
            castBy,
            title: skill.title,
            expireAt: skill?.lasts ? currentGlobalMovesCount + skill.lasts : -1,
            type: skill?.type
        }
        if (skill.canBeAppliedAt === 'figure') return this.figure?.applySkill(skillToApply);
        this.states.skillsApplied = [...this.states.skillsApplied, skillToApply];
    }

    public clearExpiredStates(currentGlobalMoveCount: number) {
        if (this.figure) this.figure.clearExpiredStates(currentGlobalMoveCount);

        this.states.skillsApplied = this.states.skillsApplied.filter(skill => skill.expireAt !== currentGlobalMoveCount)
    }

    public setEffect(args: IEffectItem) {
        this.states.effects.push(
            new VFX({ ...args })
        )
    }
    
    public clearEffects() {
        this.states.effects = []
    }

    public updateEffect(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, isFlipped: boolean) {
        let posX = isFlipped ? 7 - this.x : this.x
        let posY = isFlipped ? 7 - this.y : this.y;
        this.states.effects.forEach(effect => effect.update({ ctx, canvas, x: posX, y: posY }));
    }




}