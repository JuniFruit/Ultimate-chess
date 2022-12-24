import { FC, useState, DragEvent, memo, useRef, useCallback } from "react";
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
    }
) => {

    const isSelected = (selected?.x === cell.x) && (selected?.y === cell.y);

    const [isDraggedOver, setIsDraggedOver] = useState(false);

    const pieceRef = useRef<HTMLDivElement>(null);


    const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDraggedOver(true);
    }, [isDraggedOver])

    const checkIsAvailable = useCallback(() => {
        if ((selected && selected.figure?.legalMoves.some(move => move.pos === cell.pos)) && !isDraggedOver) {
            cell.isAvailable = true;
            return true;
        }
        cell.isAvailable = false;
        return false

    }, [selected, isDraggedOver, cell.isAvailable])

    const calcTransform = (coord: number) => {
        return (coord * 100)
    }
    

    return (
        <>

            <div
                // className={`${styles.cell} 
                // ${styles[color]} 
                // ${isSelected && styles.selected} ${isDraggedOver && styles.draggedOver} ${isPremoved && styles.premoved}`}
                className={styles.cell}
                onClick={() => { onSelect(cell) }}
                onDragEnter={handleDragOver}
                onDragOver={handleDragOver}
                onDragLeave={() => setIsDraggedOver(false)}
                onDrop={(e) => { onSelect(cell); setIsDraggedOver(false) }}
                // onDragEnd={(e) => { onSelect(cell) }}
                style={{                
                    transform: `translate(calc(${calcTransform(posX!)}%), calc(${calcTransform(posY!)}%))`,          
                }}
            >

                {checkIsAvailable() && <div className={styles.available_dot}></div>}

            </div>
            {
                figure && <Piece

                    sprite={figure.spriteSrc!}
                    x={posX}
                    y={posY}
                    key={`${figure.spriteSrc} ${figure.x + figure.y}`}
                    isDraggedOver={isDraggedOver}
                    onClick={() => onSelect(cell)}                  
                    onDragStart={(e) => { if (!isSelected) {onSelect(cell)}; }}
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