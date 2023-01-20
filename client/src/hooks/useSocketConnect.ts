import { useCallback, useEffect, useState } from "react";
import ioClient from "../api/socketApi";
import { Errors } from "../constants/constants";
import { tryReconnect } from "../services/socket.service";
import { useActions } from "./useActions";

export const useSocketConnect = () => {

    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState('');

    const { addMsg } = useActions()

    const handleOnConnect = useCallback(() => {
        setIsConnected(prev => true);
    }, [error, isConnected])

    const handleSocketError = useCallback((payload: string) => {
        setError(payload);
        setIsConnected(false);
        addMsg({ message: error, status: 500 });
    }, [error])

    const handleOnReconnect = useCallback(() => {
        setError(prev => '');
        setIsConnected(prev => true);
        addMsg({ message: 'IO Reconnected', status: 200 });
    }, [error])


    useEffect(() => {
        if (!ioClient) return;
        if (!isConnected) ioClient.connect();

        ioClient.on('connect', handleOnConnect);
        ioClient.on('connect_error', () => {
            handleSocketError(Errors.CONNECTION_LOST);
            tryReconnect();
        });
        ioClient.on('error', (err) => {
            handleSocketError(err);
        })
        ioClient.on("reconnect", () => {
            handleOnReconnect()
        })
        ioClient.on("disconnect", () => handleSocketError(Errors.CONNECTION_LOST))

        return () => {
            ioClient.off('connect');
            ioClient.off('connect_error');
            ioClient.off('error');
        }

    }, [error]);

    useEffect(() => {
        return () => {
            ioClient.disconnect();
        }
    }, [])   


    return { isConnected, error, setError };


}