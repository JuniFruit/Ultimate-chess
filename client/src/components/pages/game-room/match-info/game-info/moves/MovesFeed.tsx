import { FC, useRef } from 'react';
import { PieceInfo } from '../../../../../ui/piece/piece-info/PieceInfo';
import { IMoveFeed } from './MoveFeed.interface';
import {Positions} from '../../../../../../model/positions';
import styles from './MoveFeed.module.scss';


export const MovesFeed: FC<IMoveFeed> = ({ moves }) => {

    const listRef = useRef<HTMLOListElement>(null);      
   

    return (
        <div className={styles.move_wrapper}>
            <h3>Moves</h3>
            <ol
                ref={listRef}
                onLoad={() => {if (!listRef.current) return; listRef.current.scrollTop = listRef.current.scrollHeight;}}
                >
                {
                    moves.length
                        ?
                        moves.map((move, ind) => (

                            <li key={ind}>
                                <span>{ind + 1}.</span>
                                <PieceInfo {...{ ...move }} key={move.x + move.y} />
                                <span>{`${Positions[move.x]}${move.y + 1}`}</span>
                            </li>

                        ))
                        : null
                }
            </ol>
        </div>
    )
}