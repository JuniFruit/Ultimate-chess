import { useCallback, useEffect, useState } from "react";
import ioClient from "../../../api/socketApi";
import { SPRITES } from "../../../assets/sprites";
import { Errors, MatchDuration } from "../../../constants/constants";
import { IMove, IMovePayload } from "../../../constants/socketIO/ClientEvents.interface";
import { IBoardData, IResultPayload, IStartPayload } from "../../../constants/socketIO/ServerEvents.interface";
import { Board, IBoard } from "../../../model/Board";
import { Colors } from "../../../model/colors.enum";
import { GameOver, Results } from "../../../model/helper.enum";
import { tryReconnect } from "../../../services/socket.service";
import { IPlayerInfo } from "../../ui/player/PlayerInfo.interface";



export const useGameRoom = (id?: string) => {

    const [board, setBoard] = useState<IBoard>(new Board(SPRITES, SPRITES));
    const [isConnected, setIsConnected] = useState(ioClient.connected);
    const [isReadyToStart, setIsReadyToStart] = useState(false);
    const [result, setResult] = useState<GameOver | null>(null);
    const [enemyUser, setEnemyUser] = useState<IPlayerInfo>();
    const [clientUser, setClientUser] = useState<IPlayerInfo>()
    const [isFlipped, setIsFlipped] = useState(false);
    const [whiteTimer, setWhiteTimer] = useState<number>(MatchDuration.FIVE_MIN);
    const [blackTimer, setBlackTimer] = useState<number>(MatchDuration.FIVE_MIN);
    const [myColor, setMyColor] = useState<Colors>(Colors.WHITE)
    const [error, setError] = useState('');

    const handleOnConnect = useCallback(() => {
        setIsConnected(prev => true);
        if (error === Errors.CONNECTION_LOST) setError(prev => '');
        console.log('connected')
    }, [id, error, isConnected])

    const handleNoOpponent = useCallback(() => {
        setIsReadyToStart(false)
    }, [id, isReadyToStart, setIsReadyToStart])

    const handleReadyToStart = useCallback((payload: IStartPayload) => {
        if (!payload) return; // payload with info about the opponent

        setIsReadyToStart( true);
        setEnemyUser(payload.opponentUser);
        setBlackTimer(payload.boardData?.states.blackTime!);
        setWhiteTimer(payload.boardData?.states.whiteTime!);
        setClientUser(payload.user);
        setMyColor(payload.color!);
        setIsFlipped(payload.color === Colors.BLACK);
        drawBoard(payload.boardData!);
    }, [isConnected, setIsReadyToStart, isReadyToStart])

    const handleSendMove = useCallback((move: IMove) => {
        ioClient.emit("sendMove", move)
    }, [])

    const handleReceiveMove = useCallback((payload: IMovePayload) => {

        board.receiveMove(payload.move);
        board.states.isFirstMove = false;
        
        board.swapPlayer();
        board.updateAllLegalMoves();
        console.log(payload.time);
        setWhiteTimer(payload.time.white);
        setBlackTimer(payload.time.black);
        setBoard(prev => prev.getCopyBoard());

    }, [board, setBoard])

    const handleGameError = useCallback((payload: string) => {
        setError(payload);
        setIsConnected(false);
    }, [error, setError])


    const drawBoard = useCallback((boardData: IBoardData) => {
        board.clearBoard();
        board.startNewGame(boardData.boardFEN);
        board.states = boardData.states;
        board.updateAllLegalMoves();
        setBoard(prev => prev.getCopyBoard());

    }, [])

    const handleResults = useCallback((payload: IResultPayload) => {
        board.states.isGameOver = true;
        setResult(prev => {
            if (payload.result === Results.DRAW) return GameOver.DRAW;
            return payload.currentPlayer === Colors.BLACK ? GameOver.WHITE : GameOver.BLACK;
        });
        setBoard(prev => prev.getCopyBoard())
    }, [board])

    const handleTimeout = useCallback(() => {
        board.states.isGameOver = true;
        ioClient.emit("timeout")
        setBoard(prev => prev.getCopyBoard());
    }, [board])

    //init connection


    useEffect(() => {
        if (!ioClient) return;
        ioClient.on('connect', handleOnConnect);
        ioClient.on('connect_error', () => {
            handleGameError(Errors.CONNECTION_LOST);
            tryReconnect();
        });

        return () => {
            ioClient.off('connect', handleOnConnect);
            ioClient.off('connect_error')
        }

    }, [isConnected, error]);

    useEffect(() => {
        if (!ioClient) return;

        if (!isConnected || !id) return;
        ioClient.emit("joinGameRoom", id!)

    }, [isConnected, id])

    useEffect(() => {

        if (!isConnected) return;

        ioClient.on("noOpponent", handleNoOpponent);
        ioClient.on('gameError', handleGameError)
        ioClient.on("readyToStart", handleReadyToStart);
        ioClient.on("results", handleResults)
        return () => {
            ioClient.off("noOpponent", handleNoOpponent);
            ioClient.off('readyToStart', handleReadyToStart);
            ioClient.off("gameError", handleGameError);
            ioClient.off("results", handleResults)

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
            isFlipped,
            myColor,
            result,
            blackTimer,
            whiteTimer
        },
        data: {
            enemyUser,
            clientUser,
            error,
            setError
        },
        move: {
            handleSendMove,
            handleResults,
            handleTimeout,
        }

    }
}



