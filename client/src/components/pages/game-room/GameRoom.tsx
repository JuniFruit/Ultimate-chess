import { FC } from "react";
import { useParams } from "react-router-dom";
import { Layout } from "../../layout/Layout";
import { Field } from "./field/Field";
import { useGameRoom } from "./useGameRoom";
import styles from './GameRoom.module.scss';
import MatchInfo from "./match-info/MatchInfo";
import { WaitingModal } from "./WaitingModal";
import { PlayerInfo } from "../../ui/player/PlayerInfo";
import { useAuth } from "../../../hooks/useAuth";
import { api } from "../../../store/api/api";


const GameRoom: FC = () => {

    const { id } = useParams()
    const { field, status, data, move } = useGameRoom(id)
    const { user } = useAuth();
    const { data: profile } = api.useGetProfileQuery(null, {
        skip: !user
    })

    return (
        <Layout title="Ultimate Chess Game Room">
            <div className={styles.room_wrapper}>
                <div className={styles.board_wrapper}>
                    <PlayerInfo key={data.enemyUser?.username} {...data.enemyUser} />
                    <Field
                        board={field.board}
                        setBoard={field.setBoard}
                        ioMoveHandlers={move}
                        isFlipped={status.isFlipped}
                        myColor={status.myColor}
                    />
                    <PlayerInfo key={profile?.username} {...profile} />
                </div>
                <MatchInfo />

            </div>
            {!status.isReadyToStart && <WaitingModal />}
        </Layout>
    )
}

export default GameRoom;