import { FC } from 'react';
import { IMoveFeed } from './MoveFeed.interface';
import styles from './MoveFeed.module.scss';


export const MovesFeed: FC<IMoveFeed> = ({moves}) => {
    return (
        <div className={styles.move_wrapper}>
            <h3>Moves</h3>
            <div>

            </div>
        </div>
    )
}