import { useEffect, useState } from "react";
import ioClient from "../../../api/socketApi";
import { Board, IBoard } from "../../../model/Board";
import { EMIT_EVENTS } from "../../../constants/emitEvents"; 
import { Colors } from "../../../model/colors.enum";


export const useGameRoom = (id?: string) => {

    const [board, setBoard] = useState<IBoard>(new Board());
    const [isConnected, setIsConnected] = useState(false);
    const [isReadyToStart, setIsReadyToStart] = useState(false);

    useEffect(() => {
        drawBoard()

        ioClient.on('connect', () => {
            setIsConnected(true);
            console.log('connected')
        });

    }, [id]);

    useEffect(() => {
        if (!isConnected) return;

        ioClient.emit(EMIT_EVENTS.JOIN_GAME_ROOM, {roomId: id})

    }, [isConnected])

    useEffect(() => {

        if (!isConnected) return;

        ioClient.on(EMIT_EVENTS.NO_OPPONENT, () => setIsReadyToStart(false));
        ioClient.on(EMIT_EVENTS.READY_TO_START, (payload) => {
            setIsReadyToStart(true);         
            board.initFigures(payload.color, payload.color === Colors.WHITE ? Colors.BLACK : Colors.WHITE)
            console.log(payload)
            setBoard(board);
        })

    }, [isConnected, isReadyToStart])

    const drawBoard = () => {
        const newBoard = new Board()
        newBoard.startNewGame();        
        setBoard(newBoard);
    }

    return {
        field: {
            board,
            setBoard,
        },
        status: {
            isConnected,
            setIsReadyToStart
        }

    }
}