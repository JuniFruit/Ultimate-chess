import { FC, memo } from 'react';
import { IGameInfo } from './GameInfo.interface';
import { KillFeed } from './kill-feed/KillFeed';
import { MovesFeed } from './moves/MovesFeed';
import styles from './GameInfo.module.scss';

export const GameInfo: FC<IGameInfo> = memo(({ moves, lostFigures, currentPlayer }) => {
    return (
        <div className={styles.game_info_wrapper}>
            <MovesFeed {...{ moves }} />
            <KillFeed {...{ lostFigures, currentPlayer }} />
        </div>
    )
})