import { FC } from 'react';
import { Colors } from '../../../../../../model/colors.enum';
import { getDefaultSprite } from '../../../../../../utils/game.utils';
import { PieceInfo } from '../../../../../ui/piece/piece-info/PieceInfo';
import { IKillFeed } from './KillFeed.interface';
import styles from './KillFeed.module.scss';

export const KillFeed: FC<IKillFeed> = ({ lostFigures }) => {
    const whiteLosses = lostFigures.filter(figure => figure.color === Colors.WHITE);
    const blackLosses = lostFigures.filter(figure => figure.color === Colors.BLACK);
    return (
        <div className={styles.kill_wrapper}>
            <div>
                <h3>Black Losses</h3>
                <div className={styles.pieces}>
                    {blackLosses.length ? blackLosses.map((piece, ind) => (
                        <PieceInfo
                            sprite={getDefaultSprite(piece)}
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
                            sprite={getDefaultSprite(piece)}
                            key={ind}
                        />
                    )) : null}
                </div>

            </div>
        </div>
    )
}