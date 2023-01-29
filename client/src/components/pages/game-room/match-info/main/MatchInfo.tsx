import { FC, lazy, MouseEvent, Suspense, useTransition } from "react";
import { GiDiceShield, GiKneeling } from "react-icons/gi";
import { IoChatboxEllipsesOutline, IoGameControllerOutline, IoNotificationsCircleSharp } from "react-icons/io5";
import { Requests } from "../../../../../constants/constants";
import { Button } from "../../../../ui/button/Button";
import { ChatField } from "./chat-field/ChatField";

import { activeWindow, IMatchInfo } from "./MatchInfo.interface";
import styles from './MatchInfo.module.scss';

const DrawHandler = lazy(() => import("./footer/draw-handler/DrawHandler"));
const GameInfo = lazy(() => import("./game-info/GameInfo"));

const MatchInfo: FC<IMatchInfo> = ({
    onConfirmDraw,
    onRequestDraw,
    onRequestResign,
    onDeclineDraw,
    request,
    moves,
    lostFigures,
    isObserver,
    currentPlayer,
    chatProps,
    activeWindow,
    setActiveWindow,
    isNewMsg,
    setIsNewMsg,

}) => {
    const [isPending, setStartTransition] = useTransition()

    const handleSetWindow = (e: MouseEvent<HTMLButtonElement>) => {
        setStartTransition(() => {
            const currentValue = e.currentTarget.value as activeWindow;
            currentValue === 'chat' && setIsNewMsg(false);
            setActiveWindow(currentValue);
        })
    }

    return (
        <div className={styles.match_info_wrapper}>
            <div className={styles.match_header}>
                <div className={styles.match_buttons}>
                    <Button
                        value={'game'}
                        aria-label={'open game log'}
                        onClick={handleSetWindow}
                        className={`${styles.button} ${activeWindow === 'game' && styles.button_active}`} >
                        <span>Game</span>

                        <IoGameControllerOutline />
                    </Button>
                    <Button
                        value={'chat'}
                        aria-label={'open chat window'}
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
                                aria-label={'request a draw'}
                                className={styles.button}>
                                <span>Draw</span>
                                <GiDiceShield />
                            </Button>
                            <Button
                                onClick={onRequestResign}
                                aria-label={'resign'}
                                className={styles.button}>
                                <span>Resign</span>
                                <GiKneeling />
                            </Button>
                        </>
                        : null
                    }
                </div>
            </div>

            <Suspense fallback={null}>
                {activeWindow === 'game' ? <GameInfo {...{ lostFigures, currentPlayer, moves }} /> : null}
                <div
                    className={`${activeWindow === 'chat' ? styles.chat_wrapper_active : styles.chat_wrapper_disabled}`}
                >
                    <ChatField {...{ ...chatProps }} />
                </div>
                <div className={styles.match_info_footer}>
                    {request === Requests.DRAW ? <DrawHandler onConfirm={onConfirmDraw} onDecline={onDeclineDraw} /> : null}
                </div>
            </Suspense>




        </div>
    )
}

export default MatchInfo;