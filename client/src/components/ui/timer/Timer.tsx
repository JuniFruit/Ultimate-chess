import { FC, useEffect, useState } from "react";
import { IoTimer } from "react-icons/io5";
import { ITimer } from "./Timer.interface";
import styles from './Timer.module.scss';

export const Timer: FC<ITimer> = ({ initTime, isStopped, onTimeout }) => {
    const [currentTime, setCurrentTime] = useState(initTime)

    useEffect(() => {
        setCurrentTime(initTime)
    }, [initTime])

    useEffect(() => {
        let interval:any;
        if (isStopped) return clearInterval(interval);
        if (currentTime <= 0) return clearInterval(interval);
        interval = setInterval(() => {
            setCurrentTime(prev => prev -= 1);
        }, 1000)

        return () => {
            clearInterval(interval);
        }
    }, [isStopped, initTime]);

    useEffect(() => {
        if (currentTime === 0) {
            onTimeout();
        }

    }, [currentTime])

    return (
        <div className={styles.timer_wrapper}>
            <span>
                {Math.floor(currentTime / 60) + ':' + ('0' + Math.floor(currentTime % 60)).slice(-2)}
            </span>
            <IoTimer />
        </div>
    )
}