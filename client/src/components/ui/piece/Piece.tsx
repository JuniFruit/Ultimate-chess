import { FC, forwardRef, memo } from 'react';
import { IPiece } from './Piece.interface';
import styles from './Piece.module.scss';

export const Piece = forwardRef<HTMLDivElement, IPiece>(({ sprite, x, y, isDraggedOver, ...rest }, ref) => {

    const calcTransform = (coord: number) => {
        return (coord * 100)
    }
    return (
        <div
            className={`${styles.wrapper} ${isDraggedOver}`}
            {...rest}
            ref={ref}
            style={{                
                transform: `translate(calc(${calcTransform(x!)}%), calc(${calcTransform(y!)}%))`,
                background: `url(${sprite}) center center / contain no-repeat`
            }}
            >
        </div>
    )
})