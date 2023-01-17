import { FC, memo } from 'react';
import { getDefaultSprite, getFilteredLostFigures } from '../../../../../../../utils/game.utils';
import { PieceInfo } from '../../../../../../ui/piece/piece-info/PieceInfo';

import { IKillFeed } from './KillFeed.interface';
import styles from './KillFeed.module.scss';

export const KillFeed: FC<IKillFeed> = memo(({ lostFigures }) => {
    const [blackLosses, whiteLosses] = getFilteredLostFigures(lostFigures);

    return (
        <div className={styles.kill_wrapper}>
            <div>
                <h3>Black Losses</h3>
                <div className={styles.pieces}>
                    {blackLosses.length ? blackLosses.map((piece, ind) => (
                        <PieceInfo
                            spriteSrc={getDefaultSprite(piece)}
                            title={'piece'}
                            key={ind}
                        />
                    )) : null
                    }

                </div>

            </div>
            <div>
                <h3>White Losses</h3>
                <div className={styles.pieces}>
                    {whiteLosses.length ? whiteLosses.map((piece, ind) => (
                        <PieceInfo
                            spriteSrc={getDefaultSprite(piece)}
                            title={'piece'}
                            key={ind}
                        />
                    )) : null}
                </div>

            </div>
        </div>
    )
})