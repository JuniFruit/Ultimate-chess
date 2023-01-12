import { useCallback, useEffect } from 'react';
import ioClient from "../../../../api/socketApi";
import { IMove } from "../../../../constants/socketIO/ClientEvents.interface";
import { IUseField } from "./useField";



export interface IUseIOField extends Pick<IUseField, "board" | "setBoard" | "isObserver"> { }

export const useIOField = ({ board, setBoard, isObserver }: IUseIOField) => {


    const handleSendMove = useCallback((move: IMove) => {
        if (isObserver) return;
        board.updateAllLegalMoves();
        ioClient.emit("sendMove", move)
    }, [board, isObserver])

    const handleReceiveMove = useCallback((move: IMove) => {
        board.receiveMove(move);
        board.states.isFirstMove = false;
        board.swapPlayer();
        board.updateAllLegalMoves();

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