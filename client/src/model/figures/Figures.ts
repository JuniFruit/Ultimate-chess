import { IBoard } from "../Board";
import { ICell } from "../Cell";
import { Colors } from "../colors.enum";
import { ISprite, Sprite } from "../effects/Sprite";
import { Direction } from "../helper.enum";
import { getFigureInfo, isInBounds } from "../helpers";
import { Positions } from "../positions";
import { IBoardUlt } from "../ultimate/BoardUlt";
import { ICellUlt } from "../ultimate/CellUlt";
import { ISkillApplied, SkillList, SkillNames, SkillTypes } from "../ultimate/Skills";
import { IFigure, IFigureBase, IFigureInfo, IFigureUltimateStates, ILegalMove, ILegalMoveArg, ISpritesObj } from "./figures.interface";



export class Figure implements IFigureBase {
    readonly color;
    readonly sprites;
    ultimateStates: IFigureUltimateStates = {
        skillsApplied: []
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

    private _onTake(figure: IFigure) {
        this.lastTake = { ...figure };
        this.takes.push({ ...figure });
    }

    public moveFigure(target: ICell, board: IBoard, isFake?: boolean) {
        this.prevX = this.x;
        this.prevY = this.y;

        this.x = target.x;
        this.y = target.y;
        this.pos = `${Positions[target.x]}${7 - target.y + 1}`;


        if (isFake) return;
        if (target.figure) this._onTake(target.figure);
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
        if ((cell as ICellUlt).states && (cell as ICellUlt).isOnFire()) return true; // if cell has states, we in ultimate mode
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

    public getLegalMoves(board: IBoard | IBoardUlt) {

    }

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
        this.sprite = new Sprite({ sprite: this.spriteSrc!, framesMax: this.sprites?.frames })
    }


    public update(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, isFlipped: boolean) {
        let posX = isFlipped ? 7 - this.x : this.x
        let posY = isFlipped ? 7 - this.y : this.y;
        this.sprite?.update({ ctx, canvas, x: posX, y: posY });
    }


    /* Ultimate mode methods */


    public applySkill(skill: SkillNames, castBy: Colors, currentGlobalMovesCount: number) {
        const skillInfo = SkillList.find(item => item.title === skill)
        const skillToApply: ISkillApplied = {
            castBy,
            title: skill,
            expireAt: skillInfo?.lasts ? currentGlobalMovesCount + skillInfo.lasts : -1,
            type: skillInfo?.type
        }
        this.ultimateStates.skillsApplied = [...this.ultimateStates.skillsApplied, skillToApply];
    }

    public clearExpiredStates(currentGlobalMoveCount: number) {
        this.ultimateStates.skillsApplied = this.ultimateStates.skillsApplied.filter(skill => skill.expireAt !== currentGlobalMoveCount)
    }

    public filterDisabled() {
        const isDisabled = this.ultimateStates.skillsApplied.some(skill => skill.type === SkillTypes.DISABLER)
        if (isDisabled) this.legalMoves = [];
    }

}