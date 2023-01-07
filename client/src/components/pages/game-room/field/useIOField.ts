import ioClient from "../../../../api/socketApi";
import { IUseField } from "./useField";
import { useEffect, useCallback } from 'react';
import { IMove } from "../../../../constants/socketIO/ClientEvents.interface";
import { useSound } from "./useSound";



export interface IUseIOField extends Pick<IUseField, "board" | "setBoard" | "isObserver"> {}

export const useIOField = ({ board, setBoard, isObserver }: IUseIOField) => {

    const { handleMoveSound } = useSound(board);

    const handleSendMove = useCallback((move: IMove) => {
        if (isObserver) return;
        handleMoveSound(move);
        ioClient.emit("sendMove", move)
    }, [isObserver])

    const handleReceiveMove = useCallback((move: IMove) => {
        board.receiveMove(move);
        handleMoveSound(move);
        board.states.isFirstMove = false;
        board.swapPlayer();

        setBoard(prev => prev.getCopyBoard());

    }, [board])

    useEffect(() => {
        ioClient.on("move", handleReceiveMove);

        return () => {
            ioClient.off("move");
        }

    }, [board])


    return {
        handleSendMove
    }
}