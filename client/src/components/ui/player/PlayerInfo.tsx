import { FC, memo, PropsWithChildren } from "react";
import AvatarElement from "../user/avatar/AvatarElement";
import { IPlayerInfo } from "./PlayerInfo.interface";
import styles from './PlayerInfo.module.scss';

export const PlayerInfo: FC<PropsWithChildren<IPlayerInfo>> = memo(({ username, avatarLink, winsCount, lossesCount, children }) => {
    return (
        <div className={styles.info_container}>
            <div className={styles.info_wrapper}>
                <AvatarElement avatarPath={avatarLink} />
                <div className={styles.stats_wrapper}>
                    <h3>{username}</h3>
                    <div className={styles.stats}>
                        {winsCount ? <span>Wins: {winsCount}</span> : null}
                        {lossesCount ? <span>Losses: {lossesCount}</span> : null}
                    </div>
                </div>
            </div>
            <div className={styles.buttons}>
                {children}
            </div>
            

        </div>
    )
})