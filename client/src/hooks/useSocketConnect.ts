import { useCallback, useEffect, useState } from "react"
import ioClient from "../api/socketApi"
import { Errors } from "../constants/constants";
import { tryReconnect } from "../services/socket.service";

export const useSocketConnect = () => {

    const [isConnected, setIsConnected] = useState(ioClient.connected);
    const [error, setError] = useState('');

    const handleOnConnect = useCallback(() => {
        setIsConnected(prev => true);
        if (error === Errors.CONNECTION_LOST) setError(prev => '');
    }, [error, isConnected])

    const handleSocketError = useCallback((payload: string) => {
        setError(payload);
        setIsConnected(false);
    }, [error, setError])
    
    
    useEffect(() => {
        if (!ioClient) return;
        if (!isConnected) ioClient.connect();

        ioClient.on('connect', handleOnConnect);
        ioClient.on('connect_error', () => {
            handleSocketError(Errors.CONNECTION_LOST);
            tryReconnect();
        });

        return () => {
            ioClient.off('connect', handleOnConnect);
            ioClient.off('connect_error')
        }

    }, [isConnected, error]);

    useEffect(() => {
        return () => {
            ioClient.disconnect();

        }
    }, [])

    return {isConnected, error, setError};


}