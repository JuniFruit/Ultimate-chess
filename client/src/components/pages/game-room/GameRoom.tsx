import { FC, lazy, Suspense, useCallback, useContext } from "react";
import { IoSettingsSharp } from "react-icons/io5";
import { useParams } from "react-router-dom";
import { iconsGeneral } from "../../../assets/icons/general/iconsGeneral";
import { AudioCtx } from "../../../audio-engine/audio.provider";
import { AudioContextType } from "../../../audio-engine/audio.types";
import { Requests } from "../../../constants/constants";
import { Colors } from "../../../model/colors.enum";
import { IBoardUlt } from "../../../model/ultimate/BoardUlt";
import { Layout } from "../../layout/Layout";
import { Button } from "../../ui/button/Button";
import { Announcer } from "./announcer/Announcer";
import { useGameRoom } from "./useGameRoom";
import { TimerHandler } from "./utils/TimerHandler/TimerHandler";
import PlayerInfo from "../../ui/player/PlayerInfo";
import ErrorModal from "./modals/ErrorModal";
import styles from './GameRoom.module.scss';

const GameField = lazy(() => import("./field/Field"));
const IngameSettings = lazy(() => import("./settings/IngameSettings"));
const MatchInfo = lazy(() => import("./match-info/MatchInfo"));
const ConfirmModal = lazy(() => import("./modals/ConfirmModal"));
const GameOverModal = lazy(() => import("./modals/GameOverModal"));
const WaitingModal = lazy(() => import("./modals/WaitingModal"));


const GameRoom: FC = () => {
    const isUltimate = window.location.href.includes('_ult');
    const { id } = useParams()
    const { field, status, data } = useGameRoom(id, isUltimate);
    const { playSound } = useContext(AudioCtx) as AudioContextType

    return (
        <Layout title="Ultimate Chess Game Room">
            <Suspense fallback={null}>
                <div className={styles.room_wrapper}>
                    <div className={styles.board_wrapper}>
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

                                    <Button
                                        onClick={() => status.setIsSettingsOpen(true)}
                                    >
                                        <IoSettingsSharp />
                                    </Button>
                                    {
                                        isUltimate && !status.isObserver
                                            ?
                                            <Button onClick={() => { playSound('bookOpen'); status.setIsSkillBookOpen(prev => true) }}>
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

                    <MatchInfo
                        onRequestDraw={useCallback(() => field.handleSendRequest(Requests.DRAW), [field.handleSendRequest])}
                        onRequestResign={useCallback(() => field.handleSendRequest(Requests.RESIGN), [field.handleSendRequest])}
                        onConfirmDraw={useCallback(() => field.handleRequestConfirm(Requests.DRAW), [field.handleRequestConfirm])}
                        onDeclineDraw={useCallback(() => data.setRequest(null), [])}
                        request={data.request}
                        isFirstMove={field.board.states.isFirstMove}
                        isGameOver={field.board.states.isGameOver}
                        lostFigures={field.board.states.lostFigures}
                        moves={field.board.states.moves}
                        currentPlayer={field.board.states.currentPlayer}
                        isObserver={status.isObserver}
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
                    field.board.states.isGameOver ? <GameOverModal
                        {...{ ...status }}
                        onRematch={() => field.handleSendRequest(Requests.REMATCH)}
                    /> : null
                }
                {
                    data.request ? <ConfirmModal
                        request={data.request}
                        onConfirm={field.handleRequestConfirm}
                        onClose={() => data.setRequest(null)}
                    /> : null
                }
                {!status.isReadyToStart && status.isConnected ? <WaitingModal /> : null}
                {status.isSettingsOpen ? <IngameSettings onClose={() => status.setIsSettingsOpen(false)} /> : null}
            </Suspense>


        </Layout>
    )
}

export default GameRoom;