import { FC } from "react";
import { ICell } from "../../../../model/Cell";
import { Colors } from "../../../../model/colors.enum";
import { IFigure } from "../../../../model/figures/Figures";
import styles from './Field.module.scss';

interface ICellComponent {
    color: Colors;
    figure: IFigure | null;
    onSelect: (cell: ICell) => void;
    selected: ICell | null;
    cell: ICell;
    isAvailable: boolean
}


export const Cell: FC<ICellComponent> = ({ color, figure, onSelect, cell, selected, isAvailable }) => {
    const isSelected = (selected?.x === cell.x) && (selected?.y === cell.y);

    return (
        <div
            className={`${styles.cell} ${styles[color]} ${isSelected && styles.selected}`}
            onClick={() => { onSelect(cell) }}>
            {figure && <img src={figure?.sprite} onError={(e: any) => { e.target.onerror = null; e.target.src = ' ' }} />}
            {(isAvailable && selected) && <div className={styles.available_dot}></div>}
        </div>
    )
}