import { FC, useRef } from 'react';
import { IMoveFeed } from './MoveFeed.interface';
import styles from './MoveFeed.module.scss';
import { MoveFeedItem } from './MoveFeedItem';


export const MovesFeed: FC<IMoveFeed> = ({ moves }) => {

    const listRef = useRef<HTMLOListElement>(null);

    return (
        <div className={styles.move_wrapper}>
            <h3>Moves</h3>
            <ol
                ref={listRef}
                onLoad={() => { if (!listRef.current) return; listRef.current.scrollTop = listRef.current.scrollHeight; }}
            >
                {
                    moves.length
                        ?
                        moves.map((piece, ind) => (

                            <li key={ind}>
                                <MoveFeedItem {...{piece, listCount: ind + 1}} key={piece.x + piece.y}/>
                            </li>

                        ))
                        : null
                }
            </ol>
        </div>
    )
}