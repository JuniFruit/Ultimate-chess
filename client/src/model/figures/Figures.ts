import { IBoard } from "../Board";
import { ICell } from "../Cell";
import { Colors } from "../colors.enum";
import { IEffectItem } from "../effects/data/effects.data";
import { ISprite, Sprite } from "../effects/Sprite";
import { VFX } from "../effects/VFX";
import { Direction } from "../helper.enum";
import { getFigureInfo, isInBounds } from "../helpers";
import { Positions } from "../positions";
import { IBoardUlt } from "../ultimate/BoardUlt";
import { ICellUlt } from "../ultimate/CellUlt";
import { ISkillApplied, SkillTypes } from "../ultimate/Skills";
import { IFigure, IFigureBase, IFigureInfo, IFigureUltimateStates, ILegalMove, ILegalMoveArg, ISpritesObj } from "./figures.interface";



export abstract class Figure implements IFigureBase {
    readonly color;
    readonly sprites;
    ultimateStates: IFigureUltimateStates = {
        skillsApplied: [],
        effects: []
    }
    sprite?: ISprite;
    spriteSrc?: string;
    x;
    y;
    prevX;
    prevY;
    pos;
    lastTake: IFigureInfo | null;
    takes: IFigureInfo[] = [];
    legalMoves: ILegalMove[] = [];
    movesCount = 0;
    cellsAdvanced = 0;

    constructor(x: number, y: number, color: Colors, sprites?: ISpritesObj) {
        this.color = color;
        this.x = x;
        this.y = y;
        this.prevX = x;
        this.prevY = y;
        this.lastTake = null;
        this.sprites = sprites;
        this.pos = `${Positions[x]}${7 - y + 1}`;


    }


    public moveFigure(target: ICell, board: IBoard, isFake?: boolean) {
        this.prevX = this.x;
        this.prevY = this.y;

        this.x = target.x;
        this.y = target.y;
        this.pos = `${Positions[target.x]}${7 - target.y + 1}`;


        if (isFake) return;
        this.movesCount++;
    }

    public filterUncheckingMoves(board: IBoard | IBoardUlt) {
        if (this.color !== board.states.currentPlayer) return;
        this.legalMoves = [...this.legalMoves
            .filter(move => board.getCell(this.x, this.y).isUncheckingMove(board.getCell(move.x, move.y), board))]


    }
    /* 
        these legal moves getters are used to get potential moves in all directions. 
        If a figure has special conditions we can filter out these potential moves later in a figure class

        if direction is not specified, working in both directions 
     */

    public getLegalMovesVertical({ board, direction, numCell }: ILegalMoveArg) {

        const dir = direction ? direction : Direction.POS;
        let i = 1;
        while (i <= numCell) {
            if (!isInBounds(this.x, this.y + i * dir)) break;
            const current = board.getCell(this.x, this.y + i * dir);
            const isLast = this.addLegalMove(current);
            if (isLast) break;
            i++;
        }

        if (!direction) this.getLegalMovesVertical({ board, direction: Direction.NEG, numCell });
    }
    public getLegalMovesHorizontal({ board, direction, numCell }: ILegalMoveArg) {

        const dir = direction ? direction : Direction.POS;
        let i = 1;
        while (i <= numCell) {
            if (!isInBounds(this.x + i * dir, this.y)) break;
            const current = board.getCell(this.x + i * dir, this.y);
            const isLast = this.addLegalMove(current);
            if (isLast) break;
            i++;
        }

        if (!direction) this.getLegalMovesHorizontal({ board, direction: Direction.NEG, numCell });
    }

    public getLegalMovesDiagonal({ board, direction, numCell }: ILegalMoveArg) {

        const dir = direction ? direction : Direction.POS;

        let currentInd = 1;
        while (currentInd <= numCell) {
            if (!isInBounds(this.x + currentInd * dir, this.y + currentInd * dir)) break;
            const current = board.getCell(this.x + currentInd * dir, this.y + currentInd * dir);
            const isLast = this.addLegalMove(current);
            if (isLast) break
            currentInd++;
        }
        currentInd = 1;

        while (currentInd <= numCell) {
            if (!isInBounds(this.x - currentInd * dir, this.y + currentInd * dir)) break;
            const current = board.getCell(this.x - currentInd * dir, this.y + currentInd * dir);
            const isLast = this.addLegalMove(current);
            if (isLast) break
            currentInd++;
        }

        if (!direction) this.getLegalMovesDiagonal({ board, direction: Direction.NEG, numCell });
    }




    public addLegalMove(cell: ICell | ICellUlt) {
        if (cell.isEmpty()) {
            this.legalMoves.push(this.convertToLegalMove(cell));
            return false;

        } else if (!cell.isEmpty() && cell.isEnemy(this as unknown as IFigure)) {
            this.legalMoves.push(this.convertToLegalMove(cell));
            return true;
        }
        return true;
    }

    public clearMoves() {
        this.legalMoves = [];
    }

    abstract getLegalMoves(board: IBoard | IBoardUlt): void

    public convertToLegalMove(cell: ICell | ICellUlt) {
        const figure = cell.figure ? getFigureInfo(cell.figure) : null;
        const prevFigure = cell.prevFigure ? getFigureInfo(cell.prevFigure) : null;

        return {
            pos: cell.pos,
            x: cell.x,
            y: cell.y,
            figure,
            prevFigure
        }
    }

    public undo() {
        this.x = this.prevX;
        this.y = this.prevY;
        this.pos = `${Positions[this.prevX]}${7 - this.prevY + 1}`;


    }

    public setSpriteObj() {
        this.sprite = new Sprite({ sprite: this.spriteSrc!, framesMaxWidth: this.sprites?.frames })
    }


    public update(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, isFlipped: boolean) {
        let posX = isFlipped ? 7 - this.x : this.x
        let posY = isFlipped ? 7 - this.y : this.y;
        const { imgH, imgW } = this.sprite?.rescaleToCellSize(canvas)!
        const drawArgs = { ctx, x: posX * imgW, y: posY * imgH, imgHeight: imgH, imgWidth: imgW }

        this.sprite?.update(drawArgs);
        if (this.ultimateStates.effects.length) this.ultimateStates.effects.forEach(effect => effect.update(drawArgs))
    }


    /* Ultimate mode methods */

    public setEffect(args: IEffectItem) {
        this.ultimateStates.effects.push(
            new VFX({ ...args })
        )
    }


    public applySkill(skill: ISkillApplied) {
        this.ultimateStates.skillsApplied = [...this.ultimateStates.skillsApplied, skill];
    }

    public clearExpiredStates(board: IBoardUlt) {

        const skillToExpire = this.ultimateStates.skillsApplied.find(skill => skill.expireAt === board.states.globalMovesCount);
        if (skillToExpire?.onExpire) {
            const myCell = board.getCell(this.x, this.y)
            myCell.performSkill(skillToExpire.onExpire, board)
        }


        this.ultimateStates.skillsApplied = this.ultimateStates.skillsApplied.filter(
            skill => skill.expireAt !== board.states.globalMovesCount)
    }

    public clearEffects() {
        this.ultimateStates.effects = [];
    }

    public filterDisabled() {
        const isDisabled = this.ultimateStates.skillsApplied.some(skill => skill.type === SkillTypes.DISABLER)
        if (isDisabled) this.legalMoves = [];
    }

}