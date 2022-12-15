import { ICell } from "../../../../../model/Cell";
import { Colors } from "../../../../../model/colors.enum";
import { IFigure } from "../../../../../model/figures/figures.interface";

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
    premoves: ICell[];
}