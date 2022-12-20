import { FC, useState, useEffect, useCallback, useContext, useRef } from 'react'
import { AudioCtx } from '../../../../audio-engine/audio.provider';
import { AudioContextType } from '../../../../audio-engine/audio.types';
import { IBoardStates } from '../../../../model/Board';
import { Colors } from '../../../../model/colors.enum';
import { KillThreshold } from '../../../../model/helper.enum';
import { Announces } from './Announcer.enum';
import { IAnnouncer } from './Announcer.interface'
import styles from './Announcer.module.scss';

export const Announcer: FC<IAnnouncer> = ({ players, states, myColor }) => {
    const [isActive, setIsActive] = useState(false);

    const prevStates = useRef<{ last: IBoardStates | null }>({ last: null });

    const { playSound } = useContext(AudioCtx) as AudioContextType;

    const getFisrtBlood = useCallback(() => {
        if (!prevStates.current.last) return null;
        if (states.lostFiguresCount !== 1 || prevStates.current.last.lostFiguresCount === states.lostFiguresCount) return null;
        const figure = states.lostFigures[0];
        playSound('firstblood');
        return (
            <>
                <h2>
                    <span>{figure.color === myColor ? players.opponent?.username : players.client?.username}</span> {Announces.FIRST_BLOOD}
                </h2>
            </>
        )
    }, [states.lostFiguresCount])



    const getAnnounceInfo = useCallback((team: Colors) => {
        return myColor === team ? players.client?.username : players.opponent?.username;
    }, [players, myColor])

    const getKillingAnnounce = useCallback(() => {
        
        const { whiteKillCount, blackKillCount } = states;
        if (!prevStates.current.last) return null;
        const { whiteKillCount: prevWhite, blackKillCount: prevBlack } = prevStates.current.last

        let username;
        let announce;

        if (whiteKillCount === KillThreshold.SPREE || blackKillCount === KillThreshold.SPREE) {
            announce = Announces.SPREE;
            username = whiteKillCount === KillThreshold.SPREE && whiteKillCount !== prevWhite ? getAnnounceInfo(Colors.WHITE)
                : blackKillCount === KillThreshold.SPREE && blackKillCount !== prevBlack && getAnnounceInfo(Colors.BLACK);
            playSound('spree');
        }

        if (whiteKillCount === KillThreshold.DOMINATING || blackKillCount === KillThreshold.DOMINATING)  {
            announce = Announces.DOMINATING;
            username = whiteKillCount === KillThreshold.DOMINATING && whiteKillCount !== prevWhite ? getAnnounceInfo(Colors.WHITE)
                : blackKillCount === KillThreshold.DOMINATING && blackKillCount !== prevBlack && getAnnounceInfo(Colors.BLACK);
            playSound('dominating');
        }


        if (whiteKillCount === KillThreshold.UNSTOPPABLE || blackKillCount === KillThreshold.UNSTOPPABLE)  {
            announce = Announces.UNSTOPPABLE;
            username = whiteKillCount === KillThreshold.UNSTOPPABLE && whiteKillCount !== prevWhite ? getAnnounceInfo(Colors.WHITE)
                : blackKillCount === KillThreshold.UNSTOPPABLE && blackKillCount !== prevBlack && getAnnounceInfo(Colors.BLACK);
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

    }, [states.lostFiguresCount])


    const getPromotionAnnounce = useCallback(() => {
        const lastMove = states.moves[states.moves.length - 1];
        if (!lastMove || !lastMove?.options.isPromotion) return null;
        const team = lastMove.figureMove.color === Colors.WHITE ? 'White' : 'Black';
        return (
            <>
                {team && <h2>
                    <span>{team}</span> {Announces.PROMOTION}
                </h2>
                }
            </>
        )
    }, [states.globalMovesCount])

    useEffect(() => {

        if (states.isGameOver) return;
        if (states.globalMovesCount === 0) prevStates.current.last = null!;

        setIsActive(prev => true);

        const timeout = setTimeout(() => {
            setIsActive(false)
            prevStates.current.last = { ...states }
        }, 2000);

        return () => {
            clearTimeout(timeout);
        }

    }, [states.globalMovesCount, states.isGameOver, myColor]);

    if (!isActive) return null;

    return (
        <div className={styles.announcer_wrapper}>
            {getFisrtBlood()}
            {getKillingAnnounce()}
            {getPromotionAnnounce()}
        </div>
    )
}

