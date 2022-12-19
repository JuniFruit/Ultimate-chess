import { FC, useState, useEffect, useCallback, useContext } from 'react'
import { AudioCtx } from '../../../../audio-engine/audio.provider';
import { AudioContextType } from '../../../../audio-engine/audio.types';
import { Colors } from '../../../../model/colors.enum';
import { KillThreshold } from '../../../../model/helper.enum';
import { getFilteredLostFigures } from '../../../../utils/game.utils';
import { Announces } from './Announcer.enum';
import { IAnnouncer } from './Announcer.interface'
import styles from './Announcer.module.scss';

export const Announcer: FC<IAnnouncer> = ({ players, states, myColor }) => {
    const [isActive, setIsActive] = useState(true);

    const { playSound } = useContext(AudioCtx) as AudioContextType;

    const getFisrtBlood = useCallback(() => {
        if (states.lostFigures.length !== 1) return null;
        const figure = states.lostFigures[0];
        playSound('firstblood');
        return (
            <>
                <h2>
                    <span>{figure.color === myColor ? players.opponent?.username : players.client?.username}</span> {Announces.FIRST_BLOOD}
                </h2>
            </>
        )
    }, [states.lostFigures.length])

    const getAnnounceInfo = useCallback((team: Colors) => {
        return myColor === team ? players.client?.username : players.opponent?.username;
    }, [players, myColor])

    const getKillingAnnounce = useCallback(() => {
        const [whiteLosses, blackLosses] = getFilteredLostFigures(states.lostFigures);
        const whiteKillCount = blackLosses.length;
        const blackKillCount = whiteLosses.length;

        let username;
        let announce;

        if (whiteKillCount === KillThreshold.SPREE || blackKillCount === KillThreshold.SPREE) {
            announce = Announces.SPREE;
            username = whiteKillCount === KillThreshold.SPREE ? getAnnounceInfo(Colors.WHITE) : getAnnounceInfo(Colors.BLACK);
            playSound('spree');
        }

        if (whiteKillCount === KillThreshold.DOMINATING || blackKillCount === KillThreshold.DOMINATING) {
            announce = Announces.DOMINATING;
            username = whiteKillCount === KillThreshold.SPREE ? getAnnounceInfo(Colors.WHITE) : getAnnounceInfo(Colors.BLACK);
            playSound('dominating');
        }  

        
        if (whiteKillCount === KillThreshold.UNSTOPPABLE || blackKillCount === KillThreshold.UNSTOPPABLE) {
            announce = Announces.UNSTOPPABLE;
            username = whiteKillCount === KillThreshold.SPREE ? getAnnounceInfo(Colors.WHITE) : getAnnounceInfo(Colors.BLACK);
            playSound('unstoppable');
        }         
        

        return (
            <>
                {username && <h2>
                    <span>{username}</span> {announce}
                </h2>
                }
            </>
        )

    }, [states.lostFigures.length])


    useEffect(() => {
        setIsActive(prev => true);

        const timeout = setTimeout(() => {
            setIsActive(false)
        }, 3000);

        return () => {
            clearTimeout(timeout);
        }

    }, [states.lostFigures.length, states.moves, states.isGameOver, myColor]);

    if (!isActive) return null;

    return (
        <div className={styles.announcer_wrapper}>
            {getFisrtBlood()}
            {getKillingAnnounce()}
        </div>
    )
}


const areStatesEqual = (prev: IAnnouncer, next: IAnnouncer) => {

}