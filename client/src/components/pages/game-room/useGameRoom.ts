import { useCallback, useEffect, useState } from "react";
import ioClient from "../../../api/socketApi";
import { SPRITES } from "../../../assets/sprites";
import { Requests } from "../../../constants/constants";
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
    const [request, setRequest] = useState<Requests | null>(null);

    const {isConnected, error, setError} = useSocketConnect();

    const handleNoOpponent = useCallback(() => {
        setIsReadyToStart(false)
    }, [id, isReadyToStart, setIsReadyToStart])

    const handleUpdateGame = useCallback((payload: IStartPayload) => {
        if (!payload) return; // payload with info about the client
        clearStates();
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

    const clearStates = useCallback(() => {
        setRequest(null);
        setResult(null);
    }, [])

    const drawBoard = useCallback((boardData: IBoardData) => {

        const newBoard = new Board(SPRITES, SPRITES);
        newBoard.startNewGame(boardData.boardFEN);
        newBoard.states = boardData.states;
        newBoard.updateAllLegalMoves();
        setBoard(prev => newBoard);

    }, [request])

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
   
    const handleRequestConfirm = useCallback((request: Requests) => {
        console.log(request)
        clearStates()
        if (request === Requests.RESIGN) return ioClient.emit("resign");
        ioClient.emit("confirmRequest", request);

    }, [request])

    const handleSendRequest = useCallback((request: Requests) => {
        if (request === Requests.RESIGN) return setRequest(Requests.RESIGN);
        ioClient.emit("inGameRequest", request);        

    }, [])

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
        ioClient.on("results", handleResults);
        ioClient.on("inGameRequest", (request) => setRequest(request));

        return () => {
            ioClient.off("noOpponent", handleNoOpponent);
            ioClient.off('updateGame', handleUpdateGame);
            ioClient.off("gameError", (err) => setError(err));
            ioClient.off("results", handleResults)
            ioClient.off("inGameRequest", (request) => setRequest(request));
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
            handleRequestConfirm,
            handleSendRequest,
        },
        status: {
            isConnected,
            isReadyToStart,           
            isFlipped,
            myColor,
            result           
        },
        data: {
            enemyUser,
            clientUser,
            error,
            setError,
            request,
            setRequest,
        },
        move: {
            handleSendMove,
            handleResults,
            handleTimeout,
        }

    }
}



