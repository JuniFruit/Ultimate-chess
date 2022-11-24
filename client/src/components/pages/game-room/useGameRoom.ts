import { useCallback, useEffect, useRef, useState } from "react";
import ioClient from "../../../api/socketApi";
import { SPRITES } from "../../../assets/sprites";
import { IMove } from "../../../constants/socketIO/ClientEvents.interface";
import { IStartPayload } from "../../../constants/socketIO/ServerEvents.interface";
import { Board, IBoard } from "../../../model/Board";
import { Colors } from "../../../model/colors.enum";
import { IPlayerInfo } from "../../ui/player/PlayerInfo.interface";



export const useGameRoom = (id?: string) => {

    const [board, setBoard] = useState<IBoard>(new Board());
    const [isConnected, setIsConnected] = useState(false);
    const [isReadyToStart, setIsReadyToStart] = useState(false);
    const [enemyUser, setEnemyUser] = useState<IPlayerInfo>();


    const handleOnConnect = useCallback(() => {
        setIsConnected(true);
        console.log('connected')
    }, [id])

    const handleNoOpponent = useCallback(() => {
        setIsReadyToStart(false)
    }, [id])

    const handleReadyToStart = useCallback((payload: IStartPayload) => {
        if (!payload) return;

        setIsReadyToStart(true);
        board.initFigures(payload.color!, payload.color === Colors.WHITE ? Colors.BLACK : Colors.WHITE, SPRITES)
        setEnemyUser(payload.user);
        setBoard(board);
    }, [id, board])

    const handleSendMove = useCallback((move: IMove) => {
        ioClient.emit("sendMove", move)
    }, [board, setBoard])

    const handleReceiveMove = useCallback((payload: IMove) => {

        board.receiveMove(payload.currentCell, payload.targetCell);
        setBoard(board);
    }, [board, setBoard])


    const drawBoard = () => {
        const newBoard = new Board()
        newBoard.startNewGame();
        setBoard(newBoard);
    }

    //init connection


    useEffect(() => {
        if (!ioClient) return;
        drawBoard()
        ioClient.on('connect', handleOnConnect);

        return () => {
            ioClient.off('connect', handleOnConnect);
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

    useEffect(() => {
        ioClient.on("move", handleReceiveMove);

        return () => {
            ioClient.off("move", handleReceiveMove);
        }
    }, [board])

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
        },
        move: {
            handleSendMove
        }

    }
}