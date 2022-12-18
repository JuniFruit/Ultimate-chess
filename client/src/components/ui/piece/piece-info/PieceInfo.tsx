import { FC } from 'react';
import { IPieceInfo } from './PieceInfo.interface';
import styles from '../Piece.module.scss';
export const PieceInfo: FC<IPieceInfo> = ({sprite, title }) => {


    return (
        <img
            className={styles.piece_tiny}
            draggable={false}
            src={sprite}
            alt={`${title} icon`}
            onError={(e: any) => { e.target.onerror = null; e.target.src = ' ' }}
            title={title}
        />
    )
}