import ioClient from "../../../../api/socketApi";
import { IUseField } from "./useField";
import { useEffect, useCallback } from 'react';
import { IMove } from "../../../../constants/socketIO/ClientEvents.interface";
import { useMoveSound } from "./useMoveSound";



export interface IUseIOField extends Pick<IUseField, "board" | "setBoard" | "isObserver"> {
    onReceiveMove: (move: IMove) => void;
    onSendMove: (move: IMove) => void;
}

export const useIOField = ({ board, setBoard, isObserver, onReceiveMove, onSendMove }: IUseIOField) => {

    const { handleMoveSound } = useMoveSound();

    const handleSendMove = useCallback((move: IMove) => {
        if (isObserver) return;
        handleMoveSound(move);
        onSendMove(move);
        ioClient.emit("sendMove", move)
    }, [isObserver])

    const handleReceiveMove = useCallback((move: IMove) => {
        board.receiveMove(move);
        handleMoveSound(move);
        onReceiveMove(move);
        board.states.isFirstMove = false;
        board.swapPlayer();

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