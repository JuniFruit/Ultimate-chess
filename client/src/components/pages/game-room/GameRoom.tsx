import { FC } from "react";
import { useParams } from "react-router-dom";
import { Layout } from "../../layout/Layout";
import { GameField } from "./field/Field";
import { useGameRoom } from "./useGameRoom";
import styles from './GameRoom.module.scss';
import MatchInfo from "./match-info/MatchInfo";
import { WaitingModal } from "./modals/WaitingModal";
import { PlayerInfo } from "../../ui/player/PlayerInfo";
import { ErrorModal } from "./modals/ErrorModal";
import { GameOverModal } from "./modals/GameOverModal";
import { Colors } from "../../../model/colors.enum";
import { Requests } from "../../../constants/constants";
import { ConfirmModal } from "./modals/ConfirmModal";
import { TimerHandler } from "./utils/TimerHandler/TimerHandler";


const GameRoom: FC = () => {

    const { id } = useParams()
    const { field, status, data } = useGameRoom(id)

    return (
        <Layout title="Ultimate Chess Game Room">
            <div className={styles.room_wrapper}>
                <div className={styles.board_wrapper}>
                    <div className={styles.player_bar}>
                        {data.enemyUser && <PlayerInfo key={data.enemyUser?.username} {...data.enemyUser} />}
                        {
                            status.isReadyToStart && <TimerHandler
                                states={field.board.states}
                                initTime={status.myColor === Colors.WHITE ? field.board.states.whiteTime : field.board.states.blackTime}
                                {...{ ...status }}
                                isStopped={status.myColor === field.board.states.currentPlayer}
                                key={'opponent'}
                            />
                        }
                    </div>
                    <GameField
                        board={field.board}
                        setBoard={field.setBoard}
                        myColor={status.myColor}
                        isObserver={status.isObserver}
                    />
                    <div className={styles.player_bar}>
                        {data.clientUser && <PlayerInfo key={data.clientUser?.username} {...data.clientUser} />}
                        {
                            status.isReadyToStart && <TimerHandler
                                states={field.board.states}
                                initTime={status.myColor === Colors.WHITE ? field.board.states.whiteTime : field.board.states.blackTime}
                                {...{ ...status }}
                                isStopped={status.myColor !== field.board.states.currentPlayer}
                                key={'client'}

                            />
                        }




                    </div>
                </div>
                <MatchInfo
                    onRequestDraw={() => field.handleSendRequest(Requests.DRAW)}
                    onRequestResign={() => field.handleSendRequest(Requests.RESIGN)}
                    onConfirmDraw={() => field.handleRequestConfirm(Requests.DRAW)}
                    onDeclineDraw={() => data.setRequest(null)}
                    request={data.request}
                    states={field.board.states}
                    isObserver={status.isObserver}
                />

            </div>
            {!status.isReadyToStart && status.isConnected ? <WaitingModal /> : null}
            {data.error && <ErrorModal errorMsg={data.error} errorHandler={data.setError} />}
            <GameOverModal
                resultMsg={status.result}
                onRematch={() => field.handleSendRequest(Requests.REMATCH)}
            />
            <ConfirmModal
                request={data.request}
                onConfirm={field.handleRequestConfirm}
                onClose={() => data.setRequest(null)}
            />


        </Layout>
    )
}

export default GameRoom;