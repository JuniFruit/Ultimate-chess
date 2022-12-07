import { FC, useState, DragEvent, memo } from "react";
import { Piece } from "../../../ui/piece/Piece";
import { ICellComponent } from "./Cell.interface";

import styles from './Field.module.scss';

export const Cell: FC<ICellComponent> = memo((
    {
        color,
        figure,
        onSelect,
        cell,
        selected,
        isAvailable,      
     }
) => {

    const isSelected = (selected?.x === cell.x) && (selected?.y === cell.y);
    const [isDraggedOver, setIsDraggedOver] = useState(false);

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
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
            draggable
        >
            {
                figure && <Piece
                    sprite={figure.sprite!}
                    key={figure.sprite}
                />
            }
            {(isAvailable && selected) && <div className={styles.available_dot}></div>}

        </div>
    )
})