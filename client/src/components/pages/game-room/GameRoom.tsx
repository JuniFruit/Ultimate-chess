import { FC, lazy, Suspense, useCallback, useContext, useEffect } from "react";
import { IoGridSharp, IoNotificationsCircleSharp, IoOptions } from "react-icons/io5";
import { useParams } from "react-router-dom";
import { iconsGeneral } from "../../../assets/icons/general/iconsGeneral";
import { AudioCtx } from "../../../audio-engine/audio.provider";
import { AudioContextType } from "../../../audio-engine/audio.types";
import { Requests } from "../../../constants/constants";
import { Colors } from "../../../model/colors.enum";
import { IBoardUlt } from "../../../model/ultimate/BoardUlt";
import { setTabTitle } from "../../../utils/general.utils";
import { Button } from "../../ui/button/Button";
import PlayerInfo from "../../ui/player/PlayerInfo";
import { Announcer } from "./announcer/Announcer";
import styles from './GameRoom.module.scss';
import ErrorModal from "./modals/ErrorModal";
import { useGameRoom } from "./useGameRoom";
import { TimerHandler } from "./utils/TimerHandler/TimerHandler";

const GameField = lazy(() => import("./field/Field"));
const IngameSettings = lazy(() => import("./settings/IngameSettings"));
const MatchInfoContainer = lazy(() => import("./match-info/MatchInfoContainer"));
const WaitingModal = lazy(() => import("./modals/WaitingModal"));
const DisconnectUser = lazy(() => import("./disconnect-user/DisconnectUser"));
let ConfirmModal: FC<any>;
let GameOverModal: FC<any>


const GameRoom: FC = () => {
    const isUltimate = window.location.href.includes('_ult');
    const { id } = useParams()
    const { field, status, data } = useGameRoom(id, isUltimate);
    const { playSound } = useContext(AudioCtx) as AudioContextType

    setTabTitle("Ultimate Chess Game Room");

    useEffect(() => {
        const deferModals = async () => {
            const confirmMod = await import("./modals/ConfirmModal");
            ConfirmModal = confirmMod.default
            const gameOverMod = await import("./modals/GameOverModal");
            GameOverModal = gameOverMod.default;
        }
        deferModals()
    }, [])

    return (
        <>

            <Suspense fallback={null}>
                <div className={styles.room_wrapper}>
                    <div className={styles.board_wrapper}>
                        <div className={styles.player_bar_wrapper}>
                            <div className={styles.player_bar}>
                                {
                                    data.enemyUser && <PlayerInfo
                                        key={'enemyInfo'}
                                        {...data.enemyUser}
                                    />
                                }
                                {
                                    status.isReadyToStart && <TimerHandler
                                        states={field.board.states}
                                        initTime={status.myColor === Colors.WHITE ? field.board.states.blackTime : field.board.states.whiteTime}
                                        board={field.board}
                                        setBoard={field.setBoard}
                                        isObserver={status.isObserver}
                                        myColor={status.myColor}
                                        isStopped={status.myColor === field.board.states.currentPlayer}
                                        key={'opponent'}
                                    />
                                }
                            </div>
                            <DisconnectUser
                                isFirstMove={field.board.states.isFirstMove}
                                isGameOver={field.board.states.isGameOver}
                                isObserver={status.isObserver}
                            />
                        </div>
                        {
                            status.isReadyToStart ? <GameField
                                board={field.board}
                                myColor={status.myColor}
                                isObserver={status.isObserver}
                                isSkillBookOpen={status.isSkillBookOpen}
                                setIsSkillBookOpen={status.setIsSkillBookOpen}
                                isUltimate={isUltimate}
                            /> : null
                        }

                        <div className={styles.player_bar}>
                            {
                                data.clientUser && <PlayerInfo
                                    key={'clientInfo'}
                                    {...data.clientUser}>

                                    {status.isMobile ?
                                        <Button
                                            onClick={() => { status.setMobileMatchInfoOpen(true); status.handleSetNotification(false) }}
                                            aria-label={'open game log'}
                                        >
                                            <IoGridSharp />
                                            {status.isNotification ?
                                                <div className={styles.new_msg_pop}>
                                                    <IoNotificationsCircleSharp />
                                                </div> : null
                                            }
                                        </Button> : null
                                    }

                                    <Button
                                        onClick={() => status.setIsSettingsOpen(true)}
                                        aria-label={'open audio settings'}
                                    >
                                        <IoOptions />
                                    </Button>

                                    {isUltimate && !status.isObserver
                                        ?
                                        <Button
                                            onClick={() => { playSound('bookOpen'); status.setIsSkillBookOpen(prev => true) }}
                                            aria-label={'open skill book'}

                                        >
                                            <img src={iconsGeneral.book} alt="skill book" />
                                        </Button> : null
                                    }

                                </PlayerInfo>
                            }
                            {
                                status.isReadyToStart && <TimerHandler
                                    states={field.board.states}
                                    initTime={status.myColor === Colors.WHITE ? field.board.states.whiteTime : field.board.states.blackTime}
                                    board={field.board}
                                    setBoard={field.setBoard}
                                    isObserver={status.isObserver}
                                    myColor={status.myColor}
                                    isStopped={status.myColor !== field.board.states.currentPlayer}
                                    key={'client'}

                                />
                            }
                        </div>

                    </div>
                    <MatchInfoContainer
                        onRequestDraw={useCallback(() => field.handleSendRequest(Requests.DRAW), [field.handleSendRequest])}
                        onRequestResign={useCallback(() => field.handleSendRequest(Requests.RESIGN), [field.handleSendRequest])}
                        onConfirmDraw={useCallback(() => field.handleRequestConfirm(Requests.DRAW), [field.handleRequestConfirm])}
                        onDeclineDraw={useCallback(() => data.setRequest(null), [])}
                        onCloseMobile={useCallback(() => status.setMobileMatchInfoOpen(false), [])}
                        onNewNotification={status.handleSetNotification}
                        request={data.request}
                        lostFigures={field.board.states.lostFigures}
                        moves={field.board.states.moves}
                        currentPlayer={field.board.states.currentPlayer}
                        isObserver={status.isObserver}
                        isMobileOpen={status.isMobileMatchInfoOpen}
                    />

                    <Announcer
                        isUltimate={isUltimate}
                        players={{
                            client: data.clientUser,
                            opponent: data.enemyUser
                        }}
                        states={{
                            ...field.board.states,
                            skillsUsed: (field.board as IBoardUlt).states.skillsUsed
                        }}
                        myColor={status.myColor}
                    />
                </div>
            </Suspense>
            <ErrorModal />
            <Suspense fallback={null}>
                {
                    field.board.states.isGameOver && GameOverModal ? <GameOverModal
                        {...{ ...status }}
                        onRematch={() => field.handleSendRequest(Requests.REMATCH)}
                    /> : null
                }
                {
                    data.request && ConfirmModal ? <ConfirmModal
                        request={data.request}
                        onConfirm={field.handleRequestConfirm}
                        onClose={() => data.setRequest(null)}
                    /> : null
                }
                {!status.isReadyToStart && status.isConnected ? <WaitingModal /> : null}
                {status.isSettingsOpen ? <IngameSettings onClose={() => status.setIsSettingsOpen(false)} /> : null}
            </Suspense>
        </>


    )
}

export default GameRoom;