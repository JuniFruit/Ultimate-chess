import { FC, useState, DragEvent } from "react";
import { ICell } from "../../../../model/Cell";
import { Colors } from "../../../../model/colors.enum";
import { IFigure } from "../../../../model/figures/Figures";
import { Piece } from "../../../ui/piece/Piece";

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
    const [isDraggedOver, setIsDraggedOver] = useState(false);

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        if (!isAvailable) return;
        e.preventDefault();
        setIsDraggedOver(true);
    }

    return (
        <div
            className={`${styles.cell} ${styles[color]} ${isSelected && styles.selected} ${isDraggedOver && styles.draggedOver}`}
            onClick={() => { onSelect(cell) }}
            onDragEnter={handleDragOver}
            onDragOver={handleDragOver}
            onDragLeave={() => setIsDraggedOver(false)}
            onDrop={() => { onSelect(cell); setIsDraggedOver(false) }}
            onDragStart={(e) => { console.log(e); onSelect(cell) }}
            onDragEnd={(e) => { onSelect(cell) }}
        >
            {
                figure && <Piece
                    sprite={figure.sprite!}
                    draggable

                />
            }
            {(isAvailable && selected) && <div className={styles.available_dot}></div>}
            {/* {cell.y} : {cell.x} */}
        </div>
    )
}