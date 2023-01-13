import { useCallback, useEffect } from 'react';
import ioClient from "../../../../api/socketApi";
import { IMove } from "../../../../constants/socketIO/ClientEvents.interface";
import { IUseField } from "./useField";



export interface IUseIOField extends Pick<IUseField, "board" | "isObserver"> { }

export const useIOField = ({ board, isObserver }: IUseIOField) => {




    const handleSendMove = useCallback((move: IMove) => {
        if (isObserver) return;
        board.updateAllLegalMoves();
        ioClient.emit("sendMove", move)
    }, [board.states.globalMovesCount, isObserver])

    const handleReceiveMove = useCallback((move: IMove) => {
        board.receiveMove(move);
        board.states.isFirstMove = false;
        board.swapPlayer();
        board.updateAllLegalMoves();

    }, [board.states.globalMovesCount])

    useEffect(() => {
        ioClient.on("move", handleReceiveMove);

        return () => {
            ioClient.off("move");
        }

    }, [board.states.globalMovesCount])




    return {
        handleSendMove
    }
}