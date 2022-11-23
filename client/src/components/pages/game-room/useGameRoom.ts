import { useCallback, useEffect, useRef, useState } from "react";
import ioClient from "../../../api/socketApi";
import { IStartPayload } from "../../../constants/socketIO/ServerEvents.interface";
import { Board, IBoard } from "../../../model/Board";
import { Colors } from "../../../model/colors.enum";
import { IPlayerInfo } from "../../ui/player/PlayerInfo.interface";



export const useGameRoom = (id?: string) => {
    
    const [board, setBoard] = useState<IBoard>(new Board());
    const [isConnected, setIsConnected] = useState(false);
    const [isReadyToStart, setIsReadyToStart] = useState(false);
    const [enemyUser, setEnemyUser] = useState<IPlayerInfo>();
    const renders = useRef(0);
    renders.current++;
    console.log({ renders: renders.current });

    const handleOnConnect = useCallback(() => {
        setIsConnected(true);
        console.log('connected')
    }, [id])

    const handleNoOpponent = useCallback(() => {
        setIsReadyToStart(false)
    }, [id])

    const handleReadyToStart = useCallback((payload:IStartPayload) => {
        setIsReadyToStart(true);
        board.initFigures(payload.color, payload.color === Colors.WHITE ? Colors.BLACK : Colors.WHITE)
        console.log(payload)
        setEnemyUser(payload.user);
        setBoard(board);
    }, [id, board])


    //init connection
    

    useEffect(() => {
        if (!ioClient) return;
        drawBoard()
        ioClient.on('connect', handleOnConnect);

        return () => {
            ioClient.off('connect', handleOnConnect)
        }

    }, [id]);

    useEffect(() => {
        if (!ioClient) return;

        if (!isConnected) return;
        ioClient.emit("joinGameRoom", id!)

    }, [isConnected, id])

    useEffect(() => {
        if (!ioClient) return;


        if (!isConnected) return;
        ioClient.on("noOpponent", handleNoOpponent);
        ioClient.on("readyToStart", handleReadyToStart);

        return () => {
            ioClient.off("noOpponent", handleNoOpponent);
            ioClient.off('readyToStart', handleReadyToStart);
        }

    }, [isConnected])

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
            isReadyToStart,
            setIsReadyToStart
        },
        data: {
            enemyUser
        }

    }
}