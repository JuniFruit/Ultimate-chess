import { useCallback, useEffect, useState } from "react";
import ioClient from "../../../api/socketApi";
import { SPRITES } from "../../../assets/sprites";
import { MatchDuration } from "../../../constants/constants";
import { IMove, IMovePayload } from "../../../constants/socketIO/ClientEvents.interface";
import { IBoardData, IResultPayload, IStartPayload } from "../../../constants/socketIO/ServerEvents.interface";
import { useSocketConnect } from "../../../hooks/useSocketConnect";
import { Board, IBoard } from "../../../model/Board";
import { Colors } from "../../../model/colors.enum";
import { GameOver, Results } from "../../../model/helper.enum";
import { IPlayerInfo } from "../../ui/player/PlayerInfo.interface";



export const useGameRoom = (id?: string) => {

    const [board, setBoard] = useState<IBoard>(new Board(SPRITES, SPRITES));
    const [isReadyToStart, setIsReadyToStart] = useState(false);
    const [result, setResult] = useState<GameOver | null>(null);
    const [enemyUser, setEnemyUser] = useState<IPlayerInfo>();
    const [clientUser, setClientUser] = useState<IPlayerInfo>()
    const [isFlipped, setIsFlipped] = useState(false);   
    const [myColor, setMyColor] = useState<Colors>(Colors.WHITE)

    const {isConnected, error, setError} = useSocketConnect()

    const handleNoOpponent = useCallback(() => {
        setIsReadyToStart(false)
    }, [id, isReadyToStart, setIsReadyToStart])

    const handleUpdateGame = useCallback((payload: IStartPayload) => {
        if (!payload) return; // payload with info about the opponent

        setIsReadyToStart( true);
        setEnemyUser(payload.opponentUser);       
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
        board.states.blackTime = payload.time.black;
        board.states.whiteTime = payload.time.white;
        board.updateAllLegalMoves();
       
        setBoard(prev => prev.getCopyBoard());

    }, [board, setBoard])



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
        ioClient.emit("timeout")
    }, [board])
   

    useEffect(() => {
        if (!ioClient) return;

        if (!isConnected || !id) return;
        ioClient.emit("joinGameRoom", id!)

    }, [isConnected, id])

    useEffect(() => {

        if (!isConnected) return;

        ioClient.on("noOpponent", handleNoOpponent);
        ioClient.on('gameError', (err) => setError(err))
        ioClient.on("updateGame", handleUpdateGame);
        ioClient.on("results", handleResults)
        return () => {
            ioClient.off("noOpponent", handleNoOpponent);
            ioClient.off('updateGame', handleUpdateGame);
            ioClient.off("gameError", (err) => setError(err));
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
            result           
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



