import { FC, memo } from 'react';
import { IPiece } from './Piece.interface';
import styles from './Piece.module.scss';

export const Piece: FC<IPiece> = memo(({ sprite, x, y, isDraggedOver, ...rest }) => {

    const calcTransform = (coord: number) => {
        return (coord * 100)
    }
    return (
        <div
            className={`${styles.wrapper} ${isDraggedOver}`}
            {...rest}
            style={{                
                transform: `translate(calc(${calcTransform(x!)}%), calc(${calcTransform(y!)}%))`,
                background: `url(${sprite}) center center / contain no-repeat`
            }}
            >
        </div>
    )
})