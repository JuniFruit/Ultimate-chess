import { useEffect, useCallback, useState } from 'react';
import ioClient from '../../../../../../api/socketApi';
import { IDisconnectedUser } from '../../../../../../constants/socketIO/ClientEvents.interface';
import { IDisconnectUserComponent } from './DisconnectUser.interface';
import { useNavigate } from 'react-router-dom';

export const useDisconnectedUser = ({isFirstMove, isGameOver ,isObserver}:IDisconnectUserComponent) => {

    const [disconnectedUser, setDisconnectedUser] = useState<IDisconnectedUser | null>(null);

    const navigate = useNavigate()

    const handleNoOpponent = useCallback((user: IDisconnectedUser) => {
        if (isGameOver || isObserver) return;
        setDisconnectedUser(user);
    }, [isGameOver, isObserver])

    const handleReconnect = useCallback(() => {
        setDisconnectedUser(null);
    }, [])

    const handleDisconnectTimeout = useCallback(() => {
        if (!disconnectedUser || isGameOver || isObserver) return;
        if (isFirstMove) return navigate('/');
        ioClient.emit("disconnectTimeout", disconnectedUser);
        setDisconnectedUser(null);

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