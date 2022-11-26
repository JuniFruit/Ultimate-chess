import {FC} from 'react';
import { IPiece } from './Piece.interface';
import styles from './Piece.module.scss';

export const Piece: FC<IPiece> = ({sprite, ...rest}) => {

    return (
        <div className={styles.wrapper} {...rest}>
            <img draggable={false} src={sprite} onError={(e: any) => { e.target.onerror = null; e.target.src = ' ' }} />
        </div>
    )
}