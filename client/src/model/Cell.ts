import { IMoveOptions } from "../constants/socketIO/ClientEvents.interface";
import { IBoard } from "./Board";
import { Colors } from "./colors.enum";
import { FigureTypes, IFigure, IMovedFigure } from "./figures/figures.interface";
import { IKing } from "./figures/King";
import { IRook } from "./figures/Rook";
import { getFigureInfo } from "./helpers";
import { Positions } from "./positions";

export interface ICell {
    readonly x: number;
    readonly y: number;
    readonly pos: string;
    readonly color: Colors;
    prevFigure: IFigure | null;
    figure: IFigure | null;
    isAvailable: boolean
    isEmpty: () => boolean;
    isEnemy: (figure: IFigure | null) => boolean;
    promote: (figureToPromote: FigureTypes, board: IBoard) => void;
    moveFigure: (target: ICell, board: IBoard, options: IMoveOptions) => void;
    isUnderAttack: (board: IBoard) => boolean;
    canMoveFigure: (target: ICell, board: IBoard) => boolean;
    isUncheckingMove: (target: ICell, board: IBoard) => boolean;
    isTargetDiagonal: (target: ICell) => boolean;
    isPromotionMove: (target: ICell) => boolean;
    isCastlingMove: (target: ICell) => boolean;
    getCellInfo: () => ICellInfo;

    undo: () => void;
}

export interface ICellInfo extends Pick<ICell, "pos" | "x" | 'y'>{};

export interface IPremove {
    figureType: FigureTypes;
    to: ICell;
}

interface ICellInit extends Pick<ICell, 'x' | 'y' | 'color' | 'figure'> { };

export class Cell implements ICell {
    readonly x: number;
    readonly y: number;
    readonly pos: string;
    prevFigure: IFigure | null = null;
    color: Colors;
    figure: IFigure | null;
    isAvailable = false;


    constructor({ x, y, color, figure }: ICellInit) {
        this.color = color;
        this.x = x;
        this.y = y;
        this.figure = figure
        this.pos = `${Positions[x]}${7 - y + 1}`
    }

    public isEmpty(): boolean {
        return this.figure === null;
    }

    private _validateMove(target: ICell, board: IBoard): boolean {

        let isValidMove = false;
        this.moveFigure(target, board, { isFake: true });
        board.updateEnemyLegalMoves();
        board.isKingChecked();
        if (!board.states.isCheck) {
            isValidMove = true;
        }
        board.undo();
        return isValidMove
    }

    public isUnderAttack(board: IBoard) {
        console.log({isAttack: this});
        return board.figures.some(figure => {
            return figure.legalMoves.some(move => move.pos === this.pos && figure.color !== board.states.currentPlayer);
        })
    }

    public isEnemy(figure: IFigure | null): boolean {
        if (!figure) return false;
        if (!this.figure) return false;
        return this.figure.color !== figure.color;
    }

    public canMoveFigure(target: ICell, board: IBoard) {

        if (target.figure?.type === FigureTypes.KING) return false;
        if (this.figure?.color !== board.states.currentPlayer) return false;
        if (this.isCastlingMove(target)) return (this.figure as IKing).canPerformCastle(target, board);

        const move = this.figure?.legalMoves.find(cell => cell.x === target.x && cell.y === target.y)
        return !!move;
    }

    
    public isTargetDiagonal(target: ICell) {
        const absX = Math.abs(target.x - this.x);
        const absY = Math.abs(target.y - this.y);
        return absX === absY;
    }
    
    public isUncheckingMove(target: ICell, board: IBoard) {
        // run a fake move to check if a king is checked after the move then undo        
        
        if (this.canMoveFigure(target, board)) {
            return this._validateMove(target, board);
        } else {
            return false
        }
        
    }
    
    private _isEnPassantMove(target: ICell) {
        if (this.figure?.type !== FigureTypes.PAWN || !target.isEmpty() || !this.isTargetDiagonal(target)) return false;      
        return true;
    }


    public isCastlingMove(target: ICell) {
        if ((this.figure?.type === FigureTypes.KING && target.figure?.type === FigureTypes.ROOK)
            && this.figure.color === target.figure.color) return true;
        return false
    }

    private _performEnPassant(target: ICell, board: IBoard, options: IMoveOptions) {
        this._makeMove(target, board, {isEnPassant: true, ...options}); 

        const cellToCapture = board.getCell(target.x, this.y);
        cellToCapture.prevFigure = cellToCapture.figure;
        cellToCapture.figure = null;
    }

    private _performCastle(target: ICell, board: IBoard) {
        (this.figure as IKing).performCastle(target, board);
        (target.figure as IRook).performCastle(board);
    }

    private _makeMove(target: ICell, board: IBoard, options: IMoveOptions) {

        this._handleAddMove(target, board, options);

        this.figure!.moveFigure(target, board, options.isFake);
        target.prevFigure = target.figure;
        target.figure = this.figure;
        this.prevFigure = this.figure;
        this.figure = null;
    }


    public moveFigure(target: ICell, board: IBoard, options: IMoveOptions) {
        if (this.isCastlingMove(target)) return this._performCastle(target, board);
        if (this._isEnPassantMove(target)) return this._performEnPassant(target,board, options);
        this._makeMove(target, board, options);
        if (!options.isFake && options.isPromotion) target.promote(options.figureToPromote!, board);
    }

    private _handleAddMove(target: ICell, board: IBoard, options: IMoveOptions) {

        let moveToAdd: IMovedFigure = {
            from: {
                x: this.x,
                y: this.y,
                pos: this.pos
            },
            to: { 
                x: target.x,
                y: target.y,
                pos: target.pos
             },
            options,
            figureMove: getFigureInfo(this.figure!)
        }

        if (options.isEnPassant) {
            const pawnToCapture = getFigureInfo(board.getCell(target.x, this.y).figure!);
            
            !options.isFake &&  board.addLostFigure({ ...pawnToCapture!, takenBy: getFigureInfo(this.figure!) })           

            moveToAdd = {
                ...moveToAdd,
                figureTaken: {...pawnToCapture!}
            }
        }
        if (target.figure && !options.isFake) {
            board.addMove({ ...moveToAdd, figureTaken: getFigureInfo(target.figure) });
            board.addLostFigure({ ...target.figure, takenBy: getFigureInfo(this.figure!) });          
            return;
        }
        board.addMove(moveToAdd);
    }

    public undo() {
        if (this.figure) this.figure.undo();

        this.figure = this.prevFigure;
        this.prevFigure = null;
    }

    public isPromotionMove(target: ICell) {
        return this.figure?.type === FigureTypes.PAWN && (target.y === 0 || target.y === 7);

    }

    public promote(figureToPromote: FigureTypes, board: IBoard) {
        if (!this.figure) return;

        const type = this.figure.color === Colors.WHITE ? figureToPromote.toUpperCase() : figureToPromote;
        board.popFigure(this.figure);
        this.figure = board.createFigure(type, this.x, this.y);
        board.figures.push(this.figure!);
    }

    public getCellInfo(): ICellInfo {
        return {
            x: this.x,
            y: this.y,
            pos: this.pos
        }
    }
}