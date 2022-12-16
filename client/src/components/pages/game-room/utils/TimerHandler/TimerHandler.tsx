import { FC, useCallback, useEffect } from "react";
import ioClient from "../../../../../api/socketApi";
import { ITimerPayload } from "../../../../../constants/socketIO/ServerEvents.interface";
import { Timer } from "../../../../ui/timer/Timer";
import { ITimerHandler } from "./TimerHandler.interface";


export const TimerHandler: FC<ITimerHandler> = ({ states: { isFirstMove, isGameOver }, ...rest }) => {

    const handleTimeout = useCallback(() => {
        if (rest.isObserver) return;
        ioClient.emit("timeout")
    }, [rest.isObserver])

    const handleUpdateTimer = useCallback((time: ITimerPayload) => {
        rest.board.states.blackTime = time.black;
        rest.board.states.whiteTime = time.white;

        rest.setBoard(prev => prev.getCopyBoard());
    }, [rest.board])

    useEffect(() => {
        ioClient.on("updateTimer", handleUpdateTimer)

        return () => {
            ioClient.off("updateTimer");
        }

    }, [rest.board])

    return (
        <Timer
            onTimeout={handleTimeout}
            initTime={rest.initTime}
            isStopped={rest.isStopped || isFirstMove || isGameOver}
        />
    )

}