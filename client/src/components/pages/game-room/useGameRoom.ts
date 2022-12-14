import { useCallback, useEffect, useState } from "react";
import ioClient from "../../../api/socketApi";
import { Requests } from "../../../constants/constants";
import { IDisconnectedUser, IMove, IMovePayload } from "../../../constants/socketIO/ClientEvents.interface";
import { IBoardData, IGameData, IResultPayload } from "../../../constants/socketIO/ServerEvents.interface";
import { useSocketConnect } from "../../../hooks/useSocketConnect";
import { Board, IBoard } from "../../../model/Board";
import { Colors } from "../../../model/colors.enum";
import { ISpritesObj } from "../../../model/figures/figures.interface";
import { GameOver, Results } from "../../../model/helper.enum";
import { assignSpritePack } from "../../../utils/game.utils";
import { IPlayerInfo } from "../../ui/player/PlayerInfo.interface";



export const useGameRoom = (id?: string) => {

    const [board, setBoard] = useState<IBoard>(new Board())
    const [isReadyToStart, setIsReadyToStart] = useState(false);
    const [result, setResult] = useState<GameOver | null>(null);
    const [enemyUser, setEnemyUser] = useState<IPlayerInfo>();
    const [clientUser, setClientUser] = useState<IPlayerInfo>()
    const [isFlipped, setIsFlipped] = useState(false);
    const [myColor, setMyColor] = useState<Colors>(Colors.WHITE)
    const [request, setRequest] = useState<Requests | null>(null);
    const [disconnectedUser, setDisconnectedUser] = useState<IDisconnectedUser | null>(null);
    const [isObserver, setIsObserver] = useState(false);
    const { isConnected, error, setError } = useSocketConnect();


    const handleNoOpponent = useCallback((user: IDisconnectedUser) => {
        if (result) return;
        setDisconnectedUser(user);
    }, [result])

    const handleReconnect = useCallback(() => {
        setDisconnectedUser(null);
    }, [])

    const handleDisconnectTimeout = useCallback(() => {
        if (!disconnectedUser || result || isObserver) return;
        if (board.states.isFirstMove) return setIsReadyToStart(false);
        ioClient.emit("disconnectTimeout", disconnectedUser);
        setDisconnectedUser(null);

    }, [disconnectedUser, result, board])

    const handleUpdateGame = useCallback((payload: IGameData) => {
        if (!payload) return; // payload with info about the client and the board
        clearStates();
        setIsReadyToStart(true);
        setEnemyUser(prev => payload.playerTwo!);
        setClientUser(prev => payload.playerOne);
        setMyColor(prev => payload.myColor!);
        setIsFlipped(prev => payload.myColor === Colors.BLACK);
        setIsObserver(prev => payload.isObserver ? payload.isObserver : false);

        drawBoard(payload.boardData!,
            assignSpritePack(payload.myColor!, payload.playerOne!, payload.playerTwo!),
            assignSpritePack(payload.myColor === Colors.BLACK ? Colors.WHITE : Colors.BLACK, payload.playerOne!, payload.playerTwo!));
    }, [])

    const handleSendMove = useCallback((move: IMove) => {
        if (isObserver) return;

        ioClient.emit("sendMove", move)
    }, [isObserver])

    const handleReceiveMove = useCallback((payload: IMovePayload) => {

        board.receiveMove(payload.move);
        board.states.isFirstMove = false;
        board.swapPlayer();
        board.states.blackTime = payload.time.black;
        board.states.whiteTime = payload.time.white;

        setBoard(prev => prev.getCopyBoard());

    }, [board])

    const clearStates = useCallback(() => {
        setRequest(null);
        setResult(null);
    }, [])

    const drawBoard = useCallback((boardData: IBoardData, whiteTeamSprites?: ISpritesObj, blackTeamSprites?: ISpritesObj) => {

        const newBoard = new Board(whiteTeamSprites, blackTeamSprites);
        newBoard.startNewGame(boardData.boardFEN);
        newBoard.states = {
            ...newBoard.states,
            ...boardData.states
        }
        newBoard.updateAllLegalMoves();
        setBoard(prev => newBoard);

    }, [request])

    const handleResults = useCallback((payload: IResultPayload) => {
        board.states.isGameOver = true;
        setResult(prev => {
            if (payload.result === Results.DRAW) return GameOver.DRAW;
            return payload.loser === Colors.BLACK ? GameOver.WHITE : GameOver.BLACK;
        });
        setBoard(prev => prev.getCopyBoard())
    }, [board])

    const handleTimeout = useCallback(() => {
        if (isObserver) return;
        ioClient.emit("timeout")
    }, [board])

    const handleRequestConfirm = useCallback((request: Requests) => {
        if (isObserver) return;

        clearStates()
        if (request === Requests.RESIGN) return ioClient.emit("resign");
        ioClient.emit("confirmRequest", request);

    }, [request, isObserver])

    const handleSendRequest = useCallback((request: Requests) => {
        if (isObserver) return;

        if (request === Requests.RESIGN) return setRequest(Requests.RESIGN);
        ioClient.emit("inGameRequest", request);

    }, [isObserver])

    useEffect(() => {
        if (!isConnected || !id) return;
        ioClient.emit("joinGameRoom", id!)

    }, [isConnected, id])

    useEffect(() => {
        ioClient.on("noOpponent", handleNoOpponent);
        ioClient.on('gameError', (err) => setError(err))
        ioClient.on("inGameRequest", (request) => setRequest(request));
        ioClient.on("reconnect", handleReconnect)

        return () => {
            ioClient.off("noOpponent", handleNoOpponent);
            ioClient.off("gameError", (err) => setError(err));
            ioClient.off("inGameRequest", (request) => setRequest(request));
            ioClient.off("reconnect")

        }

    }, [request, result, disconnectedUser, error])

    useEffect(() => {
        ioClient.on("move", handleReceiveMove);
        ioClient.on("updateGame", handleUpdateGame);
        ioClient.on("results", handleResults);
        return () => {
            ioClient.off("move", handleReceiveMove);
            ioClient.off('updateGame', handleUpdateGame);
            ioClient.on("results", handleResults);
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
            result,
            isObserver
        },
        data: {
            enemyUser,
            clientUser,
            error,
            setError,
            request,
            setRequest,
            disconnectedUser,
            handleDisconnectTimeout
        },
        move: {
            handleSendMove,
            handleResults,
            handleTimeout,
        }

    }
}



