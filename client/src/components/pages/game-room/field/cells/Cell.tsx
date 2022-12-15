import { FC, useState, DragEvent, memo, useRef, forwardRef, ForwardedRef } from "react";
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
        isPremoved,
        refCallback
    }
) => {

    const isSelected = (selected?.x === cell.x) && (selected?.y === cell.y);

    const [isDraggedOver, setIsDraggedOver] = useState(false);

    const pieceRef = useRef<HTMLDivElement>(null);
    

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDraggedOver(true);
    }

    return (
        <>

            <div
                className={`${styles.cell} ${styles[color]} 
                ${isSelected && styles.selected} ${isDraggedOver && styles.draggedOver} ${isPremoved && styles.premoved}`}
                onClick={() => { onSelect(cell) }}
                onDragEnter={handleDragOver}
                onDragOver={handleDragOver}
                onDragLeave={() => setIsDraggedOver(false)}
                onDrop={(e) => { onSelect(cell); setIsDraggedOver(false) }}
            // onDragEnd={(e) => { onSelect(cell) }}
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
                    onDragStart={(e) => { console.log(); onSelect(cell) }}
                    onMouseMove={(e) => {
                        
                        const bounds = refCallback();
                        
                        
                    }}
                    onDragEnter={handleDragOver}
                    onDragOver={handleDragOver}
                    onDragLeave={() => setIsDraggedOver(false)}
                    // onDragEnd={(e) => { onSelect(cell) }}
                    onDrop={(e) => { onSelect(cell); setIsDraggedOver(false) }}
                    ref={pieceRef}
                    draggable
                />
            }
        </>
    )
})