import { FC, useCallback } from "react";
import ioClient from "../../../../../api/socketApi";
import { Timer } from "../../../../ui/timer/Timer";
import { ITimerHandler } from "./TimerHandler.interface";


export const TimerHandler: FC<ITimerHandler> = ({ states: { isFirstMove, isGameOver }, ...rest }) => {

    const handleTimeout = useCallback(() => {
        if (rest.isObserver) return;
        ioClient.emit("timeout")
    }, [rest.isObserver])

    return (
        <Timer
            onTimeout={handleTimeout}
            initTime={rest.initTime}
            isStopped={rest.isStopped || isFirstMove || isGameOver}
        />
    )

}