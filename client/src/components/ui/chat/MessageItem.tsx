import { FC } from 'react';
import { IMessagePayload } from '../../../constants/socketIO/ServerEvents.interface';
import { formatTime } from '../../../utils/format.utils';
import styles from './MessageItem.module.scss';


export const MessageItem: FC<IMessagePayload> = ({ body, timestamp, username }) => {

    return (
        <div className={styles.message_item_wrapper}>
            <h3 className={`${username === 'You' ? styles.client_name : ''}`}>{username}</h3>
            <p>{body}</p>
            <span>{`${formatTime(new Date(timestamp).getHours())}:${formatTime(new Date(timestamp).getMinutes())}`}</span>
        </div>
    )
}