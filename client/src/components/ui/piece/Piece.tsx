import { FC } from 'react';
import { IPiece } from './Piece.interface';
import styles from './Piece.module.scss';

export const Piece: FC<IPiece> = ({ sprite, x, y, ...rest }) => {

    const calcTransform = (coord: number) => {
        return (coord * 100)
    }

    return (
        <div
            className={styles.wrapper}
            {...rest}
            style={{
                background: `url(${sprite}) center center / contain no-repeat`,
                transform: `translate(calc(${calcTransform(x!)}%), calc(${calcTransform(y!)}%))`
            }}
            >
            {/* <img draggable={false} src={sprite} onError={(e: any) => { e.target.onerror = null; e.target.src = ' ' }} /> */}
        </div>
    )
}