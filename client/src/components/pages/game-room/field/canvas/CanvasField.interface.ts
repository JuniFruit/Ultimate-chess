import { IBoard } from "../../../../../model/Board";
import {CanvasHTMLAttributes} from 'react';
import { ICell, IPremove } from "../../../../../model/Cell";
import { IBoardUlt } from "../../../../../model/ultimate/BoardUlt";
import { IFieldUltimateStates } from "../Field.interface";
import { ICellUlt } from "../../../../../model/ultimate/CellUlt";

export interface ICanvasField extends CanvasHTMLAttributes<HTMLCanvasElement> {
    cells: ICell[][];
    isFlipped: boolean;
    premoves: IPremove[];
    board: IBoard | IBoardUlt;
    ultimateStates: IFieldUltimateStates;
    onCellSelect: (cell: ICell | ICellUlt) => void;
    selected: ICell | ICellUlt | null;
}

