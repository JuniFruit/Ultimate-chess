import { useSocketConnect } from "../../../../hooks/useSocketConnect"
import ioClient from "../../../../api/socketApi"
import { useEffect, useState } from "react";
import { api } from "../../../../store/api/api";

export const useAdminHome = () => {

    const { data } = api.useGetAllQuery(null)
    const { isConnected, error } = useSocketConnect();
    const [ping, setPing] = useState<number>(0)
    const [players, setPlayers] = useState(0);
    const [rooms, setRooms] = useState(0);

    useEffect(() => {
        if (!isConnected) return;

        let interval = setInterval(() => {
            const start = Date.now();

            ioClient.emit("ping", () => {
                const duration = Date.now() - start;
                setPing(duration)
            });
        }, 1000);

        return () => {
            clearInterval(interval);
        }
    }, [isConnected])

    useEffect(() => {
        if (data) setPlayers(data?.length);
        ioClient.on("currentGames", (games) => setRooms(games.length))

        return () => {
            ioClient.off("currentGames");
        }
    }, [data])

    useEffect(() => {
        ioClient.emit("currentGames");       
    }, [])

    return {
        ping,
        error,
        players,
        rooms
    }
}