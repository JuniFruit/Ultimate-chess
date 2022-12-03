import { useCallback, useEffect, useState } from "react";
import ioClient from "../../../api/socketApi";
import { SPRITES } from "../../../assets/sprites";
import { Errors } from "../../../constants/constants";
import { IMove } from "../../../constants/socketIO/ClientEvents.interface";
import { IStartPayload } from "../../../constants/socketIO/ServerEvents.interface";
import { Board, IBoard } from "../../../model/Board";
import { Colors } from "../../../model/colors.enum";
import { Results } from "../../../model/helper.enum";
import { IPlayerInfo } from "../../ui/player/PlayerInfo.interface";



export const useGameRoom = (id?: string) => {
    const initFen = 'rnbqkbnr/pppppppp/8/8/P1N1NP2/8/PP1PP1PP/R1BQKB1R';
    const [board, setBoard] = useState<IBoard>(new Board(SPRITES, SPRITES));
    const [isConnected, setIsConnected] = useState(ioClient.connected);
    const [isReadyToStart, setIsReadyToStart] = useState(false);
    const [enemyUser, setEnemyUser] = useState<IPlayerInfo>();
    const [clientUser, setClientUser] = useState<IPlayerInfo>()
    const [isFlipped, setIsFlipped] = useState(false);
    const [myColor, setMyColor] = useState<Colors>(Colors.WHITE)
    const [error, setError] = useState('');

    const handleOnConnect = useCallback(() => {
        setIsConnected(prev => true);
        if (error === Errors.CONNECTION_LOST) setError(prev => '');
        console.log('connected')
    }, [id])

    const handleNoOpponent = useCallback(() => {
        setIsReadyToStart(prev => false)
    }, [id, isReadyToStart, setIsReadyToStart])

    const handleReadyToStart = useCallback((payload: IStartPayload) => {
        if (!payload) return; // payload with info about the opponent

        setIsReadyToStart(prev => true);
        setEnemyUser(prev => payload.user);
        setClientUser(prev => payload.opponentUser);
        setMyColor(prev => payload.color === Colors.WHITE ? Colors.BLACK : Colors.WHITE);
        setIsFlipped(prev => payload.color === Colors.WHITE);
    }, [isConnected, setIsReadyToStart, isReadyToStart])

    const handleSendMove = useCallback((move: IMove) => {
        ioClient.emit("sendMove", move)
    }, [])

    const handleReceiveMove = useCallback((payload: IMove) => {

        board.receiveMove(payload);
        board.swapPlayer();
        setBoard(prev => prev.getCopyBoard());

    }, [board, setBoard])

    const handleGameError = useCallback((payload: string) => {
        setError(prev => payload);
        setIsConnected(prev => false);
    }, [error, setError])


    const drawBoard = useCallback(() => {
        board.clearBoard();
        board.startNewGame(initFen);
        setBoard(prev => prev.getCopyBoard());

    }, [])

    const handleResults = useCallback((results: Results) => {

    }, [])

    //init connection


    useEffect(() => {
        if (!ioClient) return;

        if (!isConnected) {
            ioClient.connect();
        };

        ioClient.on('connect', handleOnConnect);
        ioClient.on('connect_error', () => handleGameError(Errors.CONNECTION_LOST));

        return () => {
            ioClient.off('connect', handleOnConnect);
            ioClient.off('connect_error')
        }

    }, [id, ioClient]);

    useEffect(() => {
        if (!ioClient) return;

        if (!isConnected) return;
        ioClient.emit("joinGameRoom", id!)

    }, [isConnected, id])

    useEffect(() => {

        if (!isConnected) return;

        ioClient.on("noOpponent", handleNoOpponent);
        ioClient.on('gameError', handleGameError)
        ioClient.on("readyToStart", handleReadyToStart);

        return () => {
            ioClient.off("noOpponent", handleNoOpponent);
            ioClient.off('readyToStart', handleReadyToStart);
            ioClient.off("gameError", handleGameError);
        }

    }, [isConnected])

    useEffect(() => {
        ioClient.on("move", handleReceiveMove);

        return () => {
            ioClient.off("move", handleReceiveMove);
        }
    }, [board])

    useEffect(() => {

        drawBoard();
    }, [])

    return {
        field: {
            board,
            setBoard,
        },
        status: {
            isConnected,
            isReadyToStart,
            setIsReadyToStart,
            isFlipped,
            myColor
        },
        data: {
            enemyUser,
            clientUser,
            error,
            setError
        },
        move: {
            handleSendMove
        }

    }
}



