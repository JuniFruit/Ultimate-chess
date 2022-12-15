import { FC, MouseEvent, useState } from "react";
import { IoGameControllerOutline, IoChatboxEllipsesOutline } from "react-icons/io5";
import { GiDiceShield, GiKneeling } from "react-icons/gi";
import styles from './MatchInfo.module.scss';
import { Button } from "../../../ui/button/Button";
import { IMatchInfo } from "./MatchInfo.interfact";
import { GameInfo } from "./game-info/GameInfo";
import Chat from "./chat/Chat";
import { DrawHandler } from "./footer/draw-handler/DrawHandler";
import { Requests } from "../../../../constants/constants";
import { DisconnectUser } from "./footer/disconnect-user/DisconnectUser";

type activeWindow = 'game' | 'chat';

const MatchInfo: FC<IMatchInfo> = ({
    onConfirmDraw,
    onRequestDraw,
    onRequestResign,
    onDeclineDraw,
    request,
    states,   
    isObserver,
 
}) => {
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
                    {!isObserver
                        ?
                        <>
                            <Button
                                onClick={onRequestDraw}

                                className={styles.button}>
                                <span>Draw</span>
                                <GiDiceShield />
                            </Button>
                            <Button
                                onClick={onRequestResign}

                                className={styles.button}>
                                <span>Resign</span>
                                <GiKneeling />
                            </Button>
                        </>
                        : null
                    }
                </div>
            </div>

            {activeWindow === 'game' ? <GameInfo {...{ ...states }} /> : null}

            <div
                className={`${activeWindow === 'chat' ? styles.chat_wrapper_active : styles.chat_wrapper_disabled}`}
            >
                <Chat />
            </div>
            <div className={styles.match_info_footer}>
                {request === Requests.DRAW ? <DrawHandler onConfirm={onConfirmDraw} onDecline={onDeclineDraw} /> : null}
             <DisconnectUser {...{ ...states, isObserver}} /> 
            </div>



        </div>
    )
}

export default MatchInfo;