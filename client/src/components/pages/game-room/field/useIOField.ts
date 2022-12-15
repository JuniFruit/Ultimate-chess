import ioClient from "../../../../api/socketApi";
import { IUseField } from "./useField";
import { useEffect, useCallback } from 'react';
import { IMove, IMovePayload } from "../../../../constants/socketIO/ClientEvents.interface";


export interface IUseIOField extends Pick<IUseField, "board" | "setBoard" | "isObserver"> { }

export const useIOField = ({ board, setBoard, isObserver }: IUseIOField) => {

    const handleSendMove = useCallback((move: IMove) => {
        if (isObserver) return;

        ioClient.emit("sendMove", move)
    }, [isObserver])

    const handleReceiveMove = useCallback((payload: IMovePayload) => {

        board.receiveMove(payload.move);
        board.states.isFirstMove = false;
        board.swapPlayer();
        board.states.blackTime = payload.time.black;
        board.states.whiteTime = payload.time.white;

        setBoard(prev => prev.getCopyBoard());

    }, [board])

    useEffect(() => {
        ioClient.on("move", handleReceiveMove);

        return () => {
            ioClient.off("move");


        }

    }, [board, isObserver])


    return {
        handleSendMove
    }
}