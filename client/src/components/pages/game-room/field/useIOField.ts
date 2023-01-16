import { useCallback, useEffect } from 'react';
import ioClient from "../../../../api/socketApi";
import { IMove } from "../../../../constants/socketIO/ClientEvents.interface";
import { IServerMove } from '../../../../constants/socketIO/ServerEvents.interface';
import { IUseField } from "./useField";



export interface IUseIOField extends Pick<IUseField, "board" | "isObserver" | "setBoard"> { }

export const useIOField = ({ board, isObserver, setBoard }: IUseIOField) => {




    const handleSendMove = useCallback((move: IMove) => {
        if (isObserver) return;
        ioClient.emit("sendMove", move)
        setBoard(prev => prev.getCopyBoard())
    }, [isObserver, board])

    const handleReceiveMove = useCallback((move: IServerMove) => {
        board.receiveMove(move);
        board.states.isFirstMove = false;
        board.states.blackTime = move.time.black;
        board.states.whiteTime = move.time.white;
        board.swapPlayer();
        board.updateAllLegalMoves();
        setBoard(prev => prev.getCopyBoard())

    }, [board])

    useEffect(() => {
        ioClient.on("move", handleReceiveMove);

        return () => {
            ioClient.off("move");
        }

    }, [handleReceiveMove])




    return {
        handleSendMove
    }
}