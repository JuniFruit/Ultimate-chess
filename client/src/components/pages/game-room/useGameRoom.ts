import { useCallback, useEffect, useState } from "react";
import ioClient from "../../../api/socketApi";
import { SPRITES } from "../../../assets/Packs/Default/sprites";
import { Requests } from "../../../constants/constants";
import { IDisconnectedUser, IMove, IMovePayload } from "../../../constants/socketIO/ClientEvents.interface";
import { IBoardData, IResultPayload, IStartPayload } from "../../../constants/socketIO/ServerEvents.interface";
import { useSocketConnect } from "../../../hooks/useSocketConnect";
import { Board, IBoard } from "../../../model/Board";
import { Colors } from "../../../model/colors.enum";
import { GameOver, Results } from "../../../model/helper.enum";
import { IUser } from "../../../types/user.interface";
import { IPlayerInfo } from "../../ui/player/PlayerInfo.interface";



export const useGameRoom = (id?: string) => {

    const [board, setBoard] = useState<IBoard>(new Board())
    const [isReadyToStart, setIsReadyToStart] = useState(false);
    const [result, setResult] = useState<GameOver | null>(null);
    const [enemyUser, setEnemyUser] = useState<IUser>();
    const [clientUser, setClientUser] = useState<IUser>()
    const [isFlipped, setIsFlipped] = useState(false);
    const [myColor, setMyColor] = useState<Colors>(Colors.WHITE)
    const [request, setRequest] = useState<Requests | null>(null);
    const [disconnectedUser, setDisconnectedUser] = useState<IDisconnectedUser | null>(null);

    const { isConnected, error, setError } = useSocketConnect();


    const handleNoOpponent = useCallback((user: IDisconnectedUser) => {
        if (result) return;
        setDisconnectedUser(user);
    }, [result])

    const handleReconnect = useCallback(() => {
        setDisconnectedUser(null);
    }, [])

    const handleDisconnectTimeout = useCallback(() => {
        if (!disconnectedUser || result) return;
        if (board.states.isFirstMove) return setIsReadyToStart(false);
        ioClient.emit("disconnectTimeout", disconnectedUser);
        setDisconnectedUser(null);

    }, [disconnectedUser, result, board])

    const handleUpdateGame = useCallback((payload: IStartPayload) => {
        if (!payload) return; // payload with info about the client and the board
        clearStates();
        setIsReadyToStart(true);
        setEnemyUser(prev => payload.opponentUser);
        setClientUser(prev => payload.user);
        setMyColor(prev => payload.color!);
        setIsFlipped(prev => payload.color === Colors.BLACK);
        drawBoard(payload.boardData!, payload.user,payload.opponentUser);
    }, [])

    const handleSendMove = useCallback((move: IMove) => {
        ioClient.emit("sendMove", move)
    }, [])

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

    const drawBoard = useCallback((boardData: IBoardData, user?: IUser, opponent?:IUser) => {
        console.log(user);
        console.log(opponent)
        const newBoard = new Board(user?.packInUse ? user.packInUse.packPath : SPRITES,
            opponent?.packInUse ? opponent.packInUse.packPath : SPRITES);
        newBoard.startNewGame(boardData.boardFEN);
        newBoard.states = boardData.states;
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
        ioClient.emit("timeout")
    }, [board])

    const handleRequestConfirm = useCallback((request: Requests) => {
        clearStates()
        if (request === Requests.RESIGN) return ioClient.emit("resign");
        ioClient.emit("confirmRequest", request);

    }, [request])

    const handleSendRequest = useCallback((request: Requests) => {
        if (request === Requests.RESIGN) return setRequest(Requests.RESIGN);
        ioClient.emit("inGameRequest", request);

    }, [])

    useEffect(() => {
        if (!isConnected || !id) return;
        ioClient.emit("joinGameRoom", id!)

    }, [isConnected, id])

    useEffect(() => {
        ioClient.on("noOpponent", handleNoOpponent);
        ioClient.on('gameError', (err) => setError(err))
        ioClient.on("updateGame", handleUpdateGame);
        ioClient.on("results", handleResults);
        ioClient.on("inGameRequest", (request) => setRequest(request));
        ioClient.on("reconnect", handleReconnect)

        return () => {
            ioClient.off("noOpponent", handleNoOpponent);
            ioClient.off('updateGame', handleUpdateGame);
            ioClient.off("gameError", (err) => setError(err));
            ioClient.off("results", handleResults)
            ioClient.off("inGameRequest", (request) => setRequest(request));
            ioClient.off("reconnect")
        }

    }, [])

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



