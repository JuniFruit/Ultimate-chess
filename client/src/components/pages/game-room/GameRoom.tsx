import { FC } from "react";
import { useHref, useParams } from "react-router-dom";
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
import { Announcer } from "./announcer/Announcer";


const GameRoom: FC = () => {
    const isUltimate = window.location.href.includes('_ult');
    const { id } = useParams()
    const { field, status, data } = useGameRoom(id, isUltimate)

    return (
        <Layout title="Ultimate Chess Game Room">
            <div className={styles.room_wrapper}>
                <div className={styles.board_wrapper}>
                    <div className={styles.player_bar}>
                        {data.enemyUser && <PlayerInfo key={data.enemyUser?.username} {...data.enemyUser} />}
                        {
                            status.isReadyToStart && <TimerHandler
                                states={field.board.states}
                                initTime={status.myColor === Colors.WHITE ? field.board.states.blackTime : field.board.states.whiteTime}
                                {...{ ...status, ...field }}
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
                                {...{ ...status, ...field }}
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
                <Announcer 
                    {...{players: {client: {...data.clientUser!},opponent: {...data.enemyUser!}}, 
                    states: {...field.board.states}, myColor: status.myColor}}
                />
            </div>
            <ErrorModal />
            <GameOverModal
                {...{ ...status }}
                onRematch={() => field.handleSendRequest(Requests.REMATCH)}
            />
            <ConfirmModal
                request={data.request}
                onConfirm={field.handleRequestConfirm}
                onClose={() => data.setRequest(null)}
            />
            {!status.isReadyToStart && status.isConnected ? <WaitingModal /> : null}


        </Layout>
    )
}

export default GameRoom;