import {FC} from 'react';
import { IMessagePayload } from '../../../constants/socketIO/ServerEvents.interface';
import styles from './MessageItem.module.scss';


export const MessageItem: FC<IMessagePayload> = ({body, timestamp, username}) => {

    return (
        <div className={styles.message_item_wrapper}>
            <h3 className={`${username === 'You' ? styles.client_name : ''}`}>{username}</h3>
            <p>{body}</p>
            <span>{`${new Date(timestamp).getHours()}:${new Date(timestamp).getMinutes()}`}</span>
        </div>
    )
}