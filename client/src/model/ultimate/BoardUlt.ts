import { Board, IBoard } from "../Board";
import { Colors } from "../colors.enum";
import { FigureTypes } from "../figures/figures.interface";
import { CellUlt } from "./CellUlt";
import { BishopUlt } from "./figures/BishopUlt";
import { IFigureUlt } from "./figures/FiguresUlt";
import { KingUlt } from "./figures/KingUlt";
import { KnightUlt } from "./figures/KnightUlt";
import { PawnUlt } from "./figures/PawnUlt";
import { QueenUlt } from "./figures/QueenUlt";
import { RookUlt } from "./figures/RookUlt";




export interface IBoardUlt extends IBoard {
    createFigure: (char: string, x: number, y: number) => IFigureUlt | null;
}

export class BoardUlt extends Board implements IBoardUlt {


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



}