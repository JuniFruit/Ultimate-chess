import { Board, IBoard, IBoardStates } from "../Board";
import { Colors } from "../colors.enum";
import { FigureTypes } from "../figures/figures.interface";
import { CellUlt, ICellUlt } from "./CellUlt";
import { BishopUlt } from "./figures/BishopUlt";
import { IFigureUlt } from "./figures/FiguresUlt";
import { KingUlt } from "./figures/KingUlt";
import { KnightUlt } from "./figures/KnightUlt";
import { PawnUlt } from "./figures/PawnUlt";
import { QueenUlt } from "./figures/QueenUlt";
import { RookUlt } from "./figures/RookUlt";
import { ISkillUsed, SkillList, SkillNames } from "./Skills";

export interface IBoardUltStates extends IBoardStates {
    skillsUsed: ISkillUsed[]
}


export interface IBoardUlt extends IBoard {
    states: IBoardUltStates   
    
    createFigure: (char: string, x: number, y: number) => IFigureUlt | null;
    addUsedSkill: (skill: SkillNames, target: ICellUlt) => void;
    isSkillUsedByPlayer: (skill: SkillNames) => boolean;
}

export class BoardUlt extends Board implements IBoardUlt {
    states:IBoardUltStates = {
        ...this.states,
        skillsUsed: []
    }

    public startNewGame(fen: string): void {
        super.startNewGame(fen);
        this._convertBoard();
    }

    private _convertBoard() {
        this.cells.forEach((row, y) => {
            row.forEach((cell, x) => {
                const newCell = new CellUlt({ ...cell });
                if (cell.figure) {
                    const char = cell.figure.color === Colors.BLACK ? cell.figure.type : cell.figure.type.toUpperCase();
                    newCell.figure = this.createFigure(char, cell.x, cell.y)
                }
                this.cells[y][x] = newCell;
            })
        })
    }

    public createFigure(char: string, x: number, y: number) {
        const type = char.toLowerCase()
        const isBlack = char === char.toLowerCase();

        switch (type) {
            case FigureTypes.BISHOP:
                return new BishopUlt(x, y,
                    isBlack ? Colors.BLACK : Colors.WHITE, isBlack ? this.states.blackTeamSprites : this.states.whiteTeamSprites)

            case FigureTypes.KING:
                return new KingUlt(x, y,
                    isBlack ? Colors.BLACK : Colors.WHITE, isBlack ? this.states.blackTeamSprites : this.states.whiteTeamSprites);

            case FigureTypes.PAWN:
                return new PawnUlt(x, y,
                    isBlack ? Colors.BLACK : Colors.WHITE, isBlack ? this.states.blackTeamSprites : this.states.whiteTeamSprites);

            case FigureTypes.KNIGHT:
                return new KnightUlt(x, y,
                    isBlack ? Colors.BLACK : Colors.WHITE, isBlack ? this.states.blackTeamSprites : this.states.whiteTeamSprites);

            case FigureTypes.QUEEN:
                return new QueenUlt(x, y,
                    isBlack ? Colors.BLACK : Colors.WHITE, isBlack ? this.states.blackTeamSprites : this.states.whiteTeamSprites);

            case FigureTypes.ROOK:
                return new RookUlt(x, y,
                    isBlack ? Colors.BLACK : Colors.WHITE, isBlack ? this.states.blackTeamSprites : this.states.whiteTeamSprites);
            default:
                return null;
        }
    }

    public updateAllLegalMoves(): void {
        super.updateAllLegalMoves();
    }

    public updateEnemyLegalMoves(): void {
        super.updateEnemyLegalMoves()
    }

    public addUsedSkill(skill: SkillNames, target: ICellUlt) {
        const skillInfo = SkillList.find(item => item.title === skill);
        const cellInfo = target.getCellInfo();
        const usedSkillInfo: ISkillUsed = {
            target: cellInfo,
            title: skillInfo?.title!,
            lasts: skillInfo?.lasts,
            appliedAt: this.states.globalMovesCount,
            castBy: this.states.currentPlayer
        }

        this.states.skillsUsed.push(usedSkillInfo);
    }

    public isSkillUsedByPlayer(skill: SkillNames) {
        return this.states.skillsUsed.some(item => item.title === skill && item.castBy === this.states.currentPlayer)
    }

    

}