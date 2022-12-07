import { FC } from "react";
import { useParams } from "react-router-dom";
import { Layout } from "../../layout/Layout";
import { Field } from "./field/Field";
import { useGameRoom } from "./useGameRoom";
import styles from './GameRoom.module.scss';
import MatchInfo from "./match-info/MatchInfo";
import { WaitingModal } from "./modals/WaitingModal";
import { PlayerInfo } from "../../ui/player/PlayerInfo";
import { useAuth } from "../../../hooks/useAuth";
import { ErrorModal } from "./modals/ErrorModal";
import { Timer } from "../../ui/timer/Timer";
import { GameOverModal } from "./modals/GameOverModal";
import { Colors } from "../../../model/colors.enum";
import { Requests } from "../../../constants/constants";
import { ConfirmModal } from "./modals/ConfirmModal";

const GameRoom: FC = () => {

    const { id } = useParams()
    const { field, status, data, move } = useGameRoom(id)
    const { user } = useAuth();

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
                                    || field.board.states.isFirstMove || field.board.states.isGameOver}
                                onTimeout={move.handleTimeout}
                            />
                        </>
                        }
                    </div>
                    <Field
                        board={field.board}
                        setBoard={field.setBoard}
                        ioMoveHandlers={move}
                        isFlipped={status.isFlipped}
                        myColor={status.myColor}
                    />
                    <div className={styles.player_bar}>
                        {data.clientUser && <>

                            <PlayerInfo key={data.clientUser?.username} {...data.clientUser} />
                            <Timer
                                initTime={status.myColor === Colors.WHITE ? field.board.states.whiteTime : field.board.states.blackTime}
                                isStopped={status.myColor !== field.board.states.currentPlayer
                                    || field.board.states.isFirstMove || field.board.states.isGameOver}
                                onTimeout={move.handleTimeout} />
                        </>
                        }


                    </div>
                </div>
                <MatchInfo />

            </div>
            {!status.isReadyToStart && status.isConnected ? <WaitingModal /> : null}
            {data.error && <ErrorModal errorMsg={data.error} errorHandler={data.setError} />}
            {status.result && <GameOverModal resultMsg={status.result} onRematch={() => field.handleSendRequest(Requests.REMATCH)} />}
            {data.request === Requests.REMATCH
                || data.request === Requests.RESIGN
                ? <ConfirmModal request={data.request} onConfirm={field.handleRequestConfirm} />
                : null
            }
        </Layout>
    )
}

export default GameRoom;