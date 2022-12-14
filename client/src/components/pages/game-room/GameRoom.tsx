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
import { Timer } from "../../ui/timer/Timer";
import { GameOverModal } from "./modals/GameOverModal";
import { Colors } from "../../../model/colors.enum";
import { Requests } from "../../../constants/constants";
import { ConfirmModal } from "./modals/ConfirmModal";


const GameRoom: FC = () => {

    const { id } = useParams()
    const { field, status, data, move } = useGameRoom(id)

    return (
        <Layout title="Ultimate Chess Game Room">
            <div className={styles.room_wrapper}>
                <div className={styles.board_wrapper}>
                    <div className={styles.player_bar}>
                        {data.enemyUser && <>
                            <PlayerInfo key={data.enemyUser?.username} {...data.enemyUser} />
                            <Timer
                                initTime={status.myColor === Colors.WHITE ? field.board.states.blackTime : field.board.states.whiteTime}
                                isStopped={status.myColor === field.board.states.currentPlayer
                                    || field.board.states.isFirstMove || !!status.result}
                                onTimeout={move.handleTimeout}
                            />
                        </>
                        }
                    </div>
                    <GameField
                        board={field.board}
                        setBoard={field.setBoard}
                        ioMoveHandlers={move}
                        isFlipped={status.isFlipped}
                        myColor={status.myColor}
                        isObserver={status.isObserver}
                    />
                    <div className={styles.player_bar}>
                        {data.clientUser && <>

                            <PlayerInfo key={data.clientUser?.username} {...data.clientUser} />
                            <Timer
                                initTime={status.myColor === Colors.WHITE ? field.board.states.whiteTime : field.board.states.blackTime}
                                isStopped={status.myColor !== field.board.states.currentPlayer
                                    || field.board.states.isFirstMove || !!status.result}
                                onTimeout={move.handleTimeout} 

                                />
                        </>
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
                    disconnectedUser={data.disconnectedUser}
                    onDisconnectTimeout={data.handleDisconnectTimeout}                 
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