import { useSocketConnect } from "../../../../hooks/useSocketConnect"
import ioClient from "../../../../api/socketApi"
import { useEffect, useState } from "react";

export const useAdminHome = () => {

    const { isConnected, error } = useSocketConnect();
    const [ping, setPing] = useState<number>(0)

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
        if (!isConnected) return;
        
        
    }, [isConnected])

    return {
        ping,
        error
    }
}