import { FC, PropsWithChildren } from "react";
import { IUser } from "../../../../types/user.interface";
import { ImagePreview } from "../../image-preview/ImagePreview";
import styles from './Items.module.scss';


interface IPlayerItem {
    user: IUser;
    onClick: () => void;
}


export const PlayerItem: FC<PropsWithChildren<IPlayerItem>> = ({ user, children, onClick }) => {


    return (
        <div
            className={styles.item_container}
            // onClick={onClick}
        >
            <ImagePreview imageSrc={user.avatarLink} />
            <span>ID: {user.id}</span>
            <span>{user.username}</span>
            <span>Pack in use {user.packInUse?.title}</span>
            <span>Packs {user.packs?.length}</span>
            <div className={styles.user_roles}>
                {
                    user.roles?.map(item => (
                        <span key={`${item.role} ${user.id}`}>{item.role}</span>
                    ))
                }
            </div>


            <div className={styles.user_stats}>
                <h3>Losses: {user.lossesCount}</h3>
                <h3>Wins: {user.winsCount}</h3>
            </div>

            <div className={styles.user_actions}>
                {children}
            </div>

        </div >
    )
}