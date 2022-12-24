import { IBoard } from "../../../../../model/Board";
import { ICell, IPremove } from "../../../../../model/Cell";
import { Colors } from "../../../../../model/colors.enum";
import { IFigure, IMovedFigure } from "../../../../../model/figures/figures.interface";
import { IBoardUlt } from "../../../../../model/ultimate/BoardUlt";

export interface ICellComponent {
    color: Colors;
    figure: IFigure | null;
    posX: number;
    posY:number;
    onSelect: (cell: ICell) => void;
    selected: ICell | null;
    cell: ICell;
    isPremoved: boolean;  
}


export interface ICellWrapper extends Pick<ICellComponent, "onSelect" | "selected" > {
    cells: ICell[][];
    isFlipped: boolean;
    premoves: IPremove[];
    board: IBoard | IBoardUlt;
}