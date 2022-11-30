import { useCallback, useEffect, useRef, useState } from "react";
import ioClient from "../../../api/socketApi";
import { SPRITES } from "../../../assets/sprites";
import { IMove } from "../../../constants/socketIO/ClientEvents.interface";
import { IStartPayload } from "../../../constants/socketIO/ServerEvents.interface";
import { Board, IBoard } from "../../../model/Board";
import { Colors } from "../../../model/colors.enum";
import { IPlayerInfo } from "../../ui/player/PlayerInfo.interface";



export const useGameRoom = (id?: string) => {
    const initFen = 'rnbqkbnr/pppppppp/8/8/P1N1NP2/8/PP1PP1PP/R1BQKB1R';
    const [board, setBoard] = useState<IBoard>(new Board(SPRITES,SPRITES));
    const [isConnected, setIsConnected] = useState(false);
    const [isReadyToStart, setIsReadyToStart] = useState(false);
    const [enemyUser, setEnemyUser] = useState<IPlayerInfo>();
    const [isFlipped, setIsFlipped] = useState(false);


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
        board.cells.length === 0 && board.startNewGame(initFen);
        setEnemyUser(payload.user);
        setBoard(board);
        setIsFlipped(prev => payload.color === Colors.BLACK);
    }, [id, board])

    const handleSendMove = useCallback((move: IMove) => {
        ioClient.emit("sendMove", move)
    }, [board, setBoard])

    const handleReceiveMove = useCallback((payload:IMove) => {
        
        board.receiveMove(payload);     
        board.swapPlayer();
        setBoard(prev => prev.getCopyBoard());

    }, [board, setBoard])


    const drawBoard = () => {
        const newBoard = new Board()
        newBoard.startNewGame(initFen);
        return newBoard
    }

    //init connection


    useEffect(() => {
        if (!ioClient) return;
        
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
            setIsReadyToStart,
            isFlipped
        },
        data: {
            enemyUser
        },
        move: {
            handleSendMove
        }

    }
}