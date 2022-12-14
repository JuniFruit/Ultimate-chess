import { FC, memo, MouseEvent, useState } from "react";
import { GiDiceShield, GiKneeling } from "react-icons/gi";
import { IoChatboxEllipsesOutline, IoGameControllerOutline, IoNotificationsCircleSharp } from "react-icons/io5";
import { Requests } from "../../../../constants/constants";
import { Button } from "../../../ui/button/Button";
import Chat from "./chat/Chat";
import { DisconnectUser } from "./footer/disconnect-user/DisconnectUser";
import { DrawHandler } from "./footer/draw-handler/DrawHandler";
import { GameInfo } from "./game-info/GameInfo";
import { IMatchInfo } from "./MatchInfo.interfact";
import styles from './MatchInfo.module.scss';

type activeWindow = 'game' | 'chat';

const MatchInfo: FC<IMatchInfo> = memo(({
    onConfirmDraw,
    onRequestDraw,
    onRequestResign,
    onDeclineDraw,
    request,
    moves,
    lostFigures,
    isObserver,
    currentPlayer,
    isFirstMove,
    isGameOver

}) => {
    const [activeWindow, setActiveWindow] = useState<activeWindow>('game');
    const [isNewMsg, setIsNewMsg] = useState(false);

    const handleSetWindow = (e: MouseEvent<HTMLButtonElement>) => {
        const currentValue = e.currentTarget.value as activeWindow;
        currentValue === 'chat' && setIsNewMsg(false);
        setActiveWindow(currentValue);
    }

    const handleNewMsg = () => {
        console.log(activeWindow);
        if (activeWindow === 'chat') return;
        setIsNewMsg(true);
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
                        {isNewMsg ?
                            <div className={styles.new_msg_pop}>
                                <IoNotificationsCircleSharp />
                            </div> : null
                        }
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

            {activeWindow === 'game' ? <GameInfo {...{ lostFigures, currentPlayer, moves }} /> : null}

            <div
                className={`${activeWindow === 'chat' ? styles.chat_wrapper_active : styles.chat_wrapper_disabled}`}
            >
                <Chat onNewMsg={handleNewMsg} />
            </div>
            <div className={styles.match_info_footer}>
                {request === Requests.DRAW ? <DrawHandler onConfirm={onConfirmDraw} onDecline={onDeclineDraw} /> : null}
                <DisconnectUser {...{ currentPlayer, isFirstMove, isGameOver, isObserver }} />
            </div>



        </div>
    )
})

export default MatchInfo;