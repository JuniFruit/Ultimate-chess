import { IBoard } from "../../../../../model/Board";
import { ICell } from "../../../../../model/Cell";
import { Colors } from "../../../../../model/colors.enum";
import { IFigure } from "../../../../../model/figures/Figures";

export interface ICellComponent {
    color: Colors;
    figure: IFigure | null;
    posX: number;
    posY:number;
    onSelect: (cell: ICell) => void;
    selected: ICell | null;
    cell: ICell;

}


export interface ICellWrapper extends Pick<ICellComponent, "onSelect" | "selected" > {
    cells: ICell[][];
    // board: IBoard;
    isFlipped: boolean;

}