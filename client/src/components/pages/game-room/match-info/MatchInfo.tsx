import { FC, MouseEvent, useState } from "react";
import { IoGameControllerOutline, IoChatboxEllipsesOutline } from "react-icons/io5";
import { GiDiceShield, GiKneeling } from "react-icons/gi";
import styles from './MatchInfo.module.scss';
import { Button } from "../../../ui/button/Button";

type activeWindow = 'game' | 'chat';

const MatchInfo: FC = () => {
    const [activeWindow, setActiveWindow] = useState<activeWindow>('game');

    const handleSetWindow = (e: MouseEvent<HTMLButtonElement>) => {
        const currentValue = e.currentTarget.value as activeWindow;
        setActiveWindow(currentValue);
    }

    return (
        <div className={styles.match_info_wrapper}>
            <div className={styles.match_header}>
                <div className={styles.match_buttons}>
                    <Button
                        value={'game'}
                        onClick={handleSetWindow}
                        className={`${styles.button} ${activeWindow === 'game' && styles.button_active}`} >
                        <span>Game</span>
                        <IoGameControllerOutline />
                    </Button>
                    <Button
                        value={'chat'}
                        onClick={handleSetWindow}
                        className={`${styles.button} ${activeWindow === 'chat' && styles.button_active}`}  >
                        <span>Chat</span>
                        <IoChatboxEllipsesOutline />
                    </Button>
                    <Button
                        className={styles.button}>
                        <span>Request Draw</span>
                        <GiDiceShield />
                    </Button>
                    <Button
                        className={styles.button}>
                        <span>Resign</span>
                        <GiKneeling />
                    </Button>
                </div>
            </div>
            <div className={styles.match_info_body}>

            </div>

        </div>
    )
}

export default MatchInfo;