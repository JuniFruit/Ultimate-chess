import { ICell } from "../../../../model/Cell";
import { Colors } from "../../../../model/colors.enum";
import { IFigure } from "../../../../model/figures/Figures";

export interface ICellComponent {
    color: Colors;
    figure: IFigure | null;
    onSelect: (cell: ICell) => void;
    selected: ICell | null;
    cell: ICell;
    isAvailable: boolean;

}