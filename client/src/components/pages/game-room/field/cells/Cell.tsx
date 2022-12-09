import { FC, useState, DragEvent, memo } from "react";
import { Piece } from "../../../../ui/piece/Piece";
import { ICellComponent } from "./Cell.interface";

import styles from '../Field.module.scss';

export const Cell: FC<ICellComponent> = memo((
    {
        color,
        figure,
        onSelect,
        posX,
        posY,
        cell,
        selected,    
    }
) => {

    const isSelected = (selected?.x === cell.x) && (selected?.y === cell.y);
   
    const [isDraggedOver, setIsDraggedOver] = useState(false);

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDraggedOver(true);
    }
    
    return (
        <>

            <div
                className={`${styles.cell} ${styles[color]} ${isSelected && styles.selected} ${isDraggedOver && styles.draggedOver}`}
                onClick={() => { onSelect(cell) }}
                onDragEnter={handleDragOver}
                onDragOver={handleDragOver}
                onDragLeave={() => setIsDraggedOver(false)}
                onDrop={(e) => { onSelect(cell) ;setIsDraggedOver(false) }}
                onDragEnd={(e) => { onSelect(cell) }}
            >
            
            {(selected && selected.figure?.legalMoves.includes(cell)) && <div className={styles.available_dot}></div>}

            </div>
            {
                figure && <Piece
                    sprite={figure.sprite!}
                    x={posX}
                    y={posY}
                    key={`${figure.sprite} ${figure.x + figure.y}`}
                    isDraggedOver={isDraggedOver}
                    onClick={() => onSelect(cell)}
                    onDragStart={(e) => {onSelect(cell)}}
                    onDragEnter={handleDragOver}
                    onDragOver={handleDragOver}
                    onDragLeave={() => setIsDraggedOver(false)}
                    onDragEnd={(e) => { onSelect(cell) }}
                    onDrop={(e) => { onSelect(cell) ;setIsDraggedOver(false) }}
                    draggable
                />
            }
        </>
    )
})