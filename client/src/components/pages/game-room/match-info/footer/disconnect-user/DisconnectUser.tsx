import { FC } from "react";
import { Timer } from "../../../../../ui/timer/Timer";
import styles from '../Handle.module.scss';
import { IDisconnectUserComponent } from "./DisconnectUser.interface";

export const DisconnectUser: FC<IDisconnectUserComponent> = ({disconnectedUser, onDisconnectTimeout}) => {

    return (
        <div className={styles.handler_wrapper}>
            <h4>{disconnectedUser.username} has left. Resign in: </h4>
            <div className={styles.timer}>
                <Timer 
                    initTime={60}
                    isStopped={disconnectedUser ? false : true}
                    onTimeout={onDisconnectTimeout}
                />
            </div>
        </div>

    )
}