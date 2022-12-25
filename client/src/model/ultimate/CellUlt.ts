import { IMoveOptions } from "../../constants/socketIO/ClientEvents.interface";
import { IBoard } from "../Board";
import { Cell, ICell, ICellInfo } from "../Cell";
import { Colors } from "../colors.enum";
import { FigureTypes, IFigure, IMovedFigure } from "../figures/figures.interface";
import { IKing } from "../figures/King";
import { IRook } from "../figures/Rook";
import { getFigureInfo } from "../helpers";
import { IBoardUlt } from "./BoardUlt";


export interface ICellUltStates {
    isPoisoned: boolean
}

export interface ICellUlt extends ICell {
    states: ICellUltStates;
    canPerformSkill: (skill: string, target: ICellUlt) => boolean;
    performSkill: (skill: string, target: ICellUlt, board: IBoardUlt) => void;
    performSacrifice: (target: ICellUlt, board: IBoardUlt) => void;
}

export class CellUlt extends Cell implements ICellUlt {
    states: ICellUltStates = {
        isPoisoned: false
    }


    public canPerformSkill(skill: string, target: ICellUlt) {
        return true;
    }

    public performSkill(skill: string, target: ICellUlt, board: IBoardUlt) {
        this.performSacrifice(target, board)
    }   

    public performSacrifice(target: ICellUlt, board: IBoardUlt) {
        board.popFigure(this.figure!);
        this.figure = null;
        this.prevFigure = null;
    }


}