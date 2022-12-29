import { IMove } from "../../constants/socketIO/ClientEvents.interface";
import { IBoardData } from "../../constants/socketIO/ServerEvents.interface";
import { Board, IBoard, IBoardStates } from "../Board";
import { ICell } from "../Cell";
import { Colors } from "../colors.enum";
import { FigureTypes, IFigure } from "../figures/figures.interface";
import { CellUlt, ICellUlt } from "./CellUlt";
import { BishopUlt } from "./figures/BishopUlt";
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

    createFigure: (char: string, x: number, y: number) => IFigure | null;
    addUsedSkill: (skill: SkillNames, target: ICellUlt) => void;
    isSkillUsedByPlayer: (skill: SkillNames) => boolean;
    mergeBoardData: (boardData: IBoardData) => void;
}

export class BoardUlt extends Board implements IBoardUlt {
    states: IBoardUltStates = {
        ...this.states,
        skillsUsed: []
    }

    public startNewGame(fen: string): void {
        super.startNewGame(fen);
        this._convertBoard();
    }


    public getCopyBoard(): Board {
        const newBoard = new BoardUlt();
        newBoard.cells = this.cells;
        newBoard.figures = this.figures;
        newBoard.states = this.states;
        newBoard.states.blackTeamSprites = this.states.blackTeamSprites;
        newBoard.states.whiteTeamSprites = this.states.whiteTeamSprites;
        return newBoard;
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

    public getCell(x: number, y: number): ICell {
        return this.cells[y][x]
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

    public updateAllLegalMoves() {

        this._clearExpiredStates();

        this.figures.forEach(figure => {
            figure.getLegalMoves(this);
            figure.filterDisabled();
            figure.filterUncheckingMoves(this)
        });
    }

    private _clearExpiredStates() {
        this.cells.forEach(row => {
            row.forEach(cell => (cell as ICellUlt).clearExpiredStates(this.states.globalMovesCount))
        })
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
        if (!this.states.skillsUsed.length) return false;
        return this.states.skillsUsed.some(item => item.title === skill && item.castBy === this.states.currentPlayer)
    }

    public receiveMove({ from, to, options }: IMove): void {
        if (options?.skill) {
            this.incrementMoveCount();
            const target = this.getCell(to.x, to.y);
            (target as ICellUlt).performSkill(options.skill, this);
            return;
        }

        super.receiveMove({ from, to, options });
    }

    public mergeBoardData(boardData: IBoardData) {
        (this.cells as ICellUlt[][]).forEach((row, y) => {
            row.forEach((cell, x) => {
                const currentBoardDataCell = boardData.board.cells[y][x] as ICellUlt
                cell.states = { ...currentBoardDataCell.states };
                if (cell.figure) {
                    cell.figure.ultimateStates = { ...currentBoardDataCell.figure?.ultimateStates! }
                }
            })
        })
    }

}