import { FC, useCallback, useEffect, useState } from 'react';
import ioClient from '../../../api/socketApi';
import { IGameRoomShortData } from '../../../constants/socketIO/ServerEvents.interface';
import { useSocketConnect } from '../../../hooks/useSocketConnect';
import { Layout } from '../../layout/Layout';
import { Spinner } from '../../ui/loading/Spinner';
import Wrapper from '../../ui/wrapper/Wrapper';
import { RoomItem } from './RoomItem';
import styles from './WatchPage.module.scss';


const WatchPage: FC = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [games, setGames] = useState<IGameRoomShortData[]>([])
    const { isConnected } = useSocketConnect();

    const handleGetCurrentGames = useCallback((payload: IGameRoomShortData[]) => {
        setIsLoading(prev => false);
        console.log(payload)
        setGames(prev => payload || []);
    }, [isLoading, games])

    const handleSendRequest = useCallback(() => {
        setIsLoading(prev => true);
        ioClient.emit("currentGames");
    }, [])

    useEffect(() => {
        if (!isConnected) return;

        ioClient.on("currentGames", handleGetCurrentGames);
        return () => {
            ioClient.off("currentGames");
        }

    }, [isConnected])

    useEffect(() => {
        if (!isConnected) return;
        handleSendRequest()
        
    }, [isConnected])

    return (
        <Layout title='Ultimate Chess Watch Games'>
            <div className={styles.page_wrapper}>
                <Wrapper title='Live Games'>
                    <div className={styles.rooms_wrapper}>
                        {
                            isLoading
                                ?

                                <Spinner />

                                : games.length
                                    ? games.map(room => (
                                        <RoomItem {...{ ...room }} key={room.room} />
                                    ))
                                    :
                                    <h2 className={styles.not_found}>No live games found</h2>
                        }
                    </div>
                </Wrapper>
            </div>
        </Layout>
    )
}


export default WatchPage