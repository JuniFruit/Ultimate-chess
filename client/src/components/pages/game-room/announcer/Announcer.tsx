import { FC, useState, useEffect, useCallback } from 'react'
import { Announces } from './Announcer.enum';
import { IAnnouncer } from './Announcer.interface'
import styles from './Announcer.module.scss';

export const Announcer: FC<IAnnouncer> = ({ players, states, myColor }) => {
    const [isActive, setIsActive] = useState(true);

    const getFisrtBloodMsg = useCallback(() => {
        if (states.lostFigures.length !== 1) return null;
        const figure = states.lostFigures[0];

        return (
            <>
                <h2>
                    <span>{figure.color === myColor ? players.opponent?.username : players.client?.username}</span> {Announces.FIRST_BLOOD}
                </h2>
            </>
        )
    }, [states.lostFigures.length])

    const getSpreeMsg = useCallback(() => {
        
    }, [])


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
            {getFisrtBloodMsg()}
        </div>
    )
}


const areStatesEqual = (prev: IAnnouncer, next: IAnnouncer) => {

}