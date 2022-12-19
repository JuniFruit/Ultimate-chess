import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { iconsGeneral } from '../../../assets/icons/general/iconsGeneral'
import { ImagePreview } from '../../ui/image-preview/ImagePreview'
import { IRoomItem } from './WatchPage.interface'
import styles from './WatchPage.module.scss';

export const RoomItem: FC<IRoomItem> = ({players, room}) => {

    const navigate = useNavigate()

    return (
        <div
            className={styles.room_item_wrapper}
            onClick={() => navigate(`/game-room/${room}`)}
            
        >
            <ImagePreview imageSrc={iconsGeneral.chessLogo} />

            <div className={styles.room_players}>
                <h3> {players[0]?.username}</h3>
                <span>VS</span>
                <h3>{players[1]?.username}</h3>
            </div>         

        </div>
    )

}