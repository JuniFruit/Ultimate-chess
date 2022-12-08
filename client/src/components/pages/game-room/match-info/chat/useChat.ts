import { useEffect, useState, useCallback } from 'react';
import ioClient from '../../../../../api/socketApi';
import { IMessage } from '../../../../../constants/socketIO/ClientEvents.interface';
import { IMessagePayload } from '../../../../../constants/socketIO/ServerEvents.interface';


export const useChat = () => {

    const [messages, setMessages] = useState<IMessagePayload[]>([]);

    const handleReceiveMessage = useCallback((payload: IMessagePayload) => {
        setMessages(prev => [...prev, payload]);
    }, [messages])

    const handleSendMessage = useCallback((message: IMessage) => {
        ioClient.emit("message", message);
        setMessages(prev => [...prev, {username: 'You', body: message.body, timestamp: Date.now()}]);
    }, [messages])

    useEffect(() => {
        if (!ioClient) return;
        ioClient.on("message", handleReceiveMessage);

        return () => {
            ioClient.off("message", handleReceiveMessage);
        }
    }, []);



    return {
        messages,
        handleSendMessage
    }
}