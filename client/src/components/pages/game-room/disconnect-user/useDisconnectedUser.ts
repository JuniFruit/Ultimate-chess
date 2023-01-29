import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ioClient from '../../../../api/socketApi';
import { IDisconnectedUser } from '../../../../constants/socketIO/ClientEvents.interface';

import { IDisconnectUserComponent } from './DisconnectUser.interface';

export const useDisconnectedUser = ({ isFirstMove, isGameOver, isObserver }: IDisconnectUserComponent) => {

    const [disconnectedUser, setDisconnectedUser] = useState<IDisconnectedUser | null>(null);

    const navigate = useNavigate()

    const handleNoOpponent = useCallback((user: IDisconnectedUser) => {
        if (isGameOver) return;
        setDisconnectedUser(prev => user);
    }, [isGameOver])

    const handleReconnect = useCallback(() => {
        setDisconnectedUser(prev => null);
    }, [])

    const handleDisconnectTimeout = useCallback(() => {
        if (!disconnectedUser || isGameOver || isObserver) return setDisconnectedUser(prev => null);
        if (isFirstMove) return navigate('/');
        ioClient.emit("disconnectTimeout", disconnectedUser);
        setDisconnectedUser(prev => null);

    }, [disconnectedUser, isGameOver, isObserver])



    useEffect(() => {
        ioClient.on("noOpponent", handleNoOpponent);
        ioClient.on("reconnect", handleReconnect)


        return () => {
            ioClient.off("noOpponent");
            ioClient.off("reconnect");
        }

    }, [isGameOver, isFirstMove, isObserver])


    return {
        disconnectedUser,
        handleDisconnectTimeout,
    }
}