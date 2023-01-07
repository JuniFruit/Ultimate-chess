import { FC, memo } from "react";
import { Timer } from "../../../../../ui/timer/Timer";
import styles from '../Handle.module.scss';
import { IDisconnectUserComponent } from "./DisconnectUser.interface";
import { useDisconnectedUser } from "./useDisconnectedUser";

export const DisconnectUser: FC<IDisconnectUserComponent> = memo((props) => {

    const { handleDisconnectTimeout, disconnectedUser } = useDisconnectedUser(props);

    if (!disconnectedUser) return null;

    return (
        <div className={`${styles.handler_wrapper} flex items-center gap-2 flex-wrap w-full`}>
            <h4>{disconnectedUser.username} has left. {`${props.isFirstMove ? 'Game abort in' : 'Resign in'}`}: </h4>
            <div className={styles.timer}>
                <Timer
                    initTime={props.isFirstMove ? 10 : 60}
                    isStopped={disconnectedUser ? false : true}
                    onTimeout={handleDisconnectTimeout}
                />
            </div>
        </div>

    )
})