import { useCallback, useContext, useEffect, useState } from 'react';
import ioClient from '../../../../../api/socketApi';
import { AudioCtx } from '../../../../../audio-engine/audio.provider';
import { AudioContextType } from '../../../../../audio-engine/audio.types';
import { IMessage } from '../../../../../constants/socketIO/ClientEvents.interface';
import { IMessagePayload } from '../../../../../constants/socketIO/ServerEvents.interface';

import { IChat } from './Chat.interface';


export const useChat = ({ onNewMsg }: IChat) => {

    const [messages, setMessages] = useState<IMessagePayload[]>([]);
    const {playSound} = useContext(AudioCtx) as AudioContextType

    const handleReceiveMessage = useCallback((payload: IMessagePayload) => {
        setMessages(prev => [...prev, payload]);
        playSound('newMsg');
        onNewMsg();
    }, [messages, onNewMsg])

    const handleSendMessage = useCallback((message: IMessage) => {
        ioClient.emit("message", message);
        setMessages(prev => [...prev, { username: 'You', body: message.body, timestamp: Date.now() }]);
    }, [messages])

    useEffect(() => {
        if (!ioClient) return;
        ioClient.on("message", handleReceiveMessage);

        return () => {
            ioClient.off("message", handleReceiveMessage);
        }
    }, [handleReceiveMessage]);



    return {
        messages,
        handleSendMessage
    }
}