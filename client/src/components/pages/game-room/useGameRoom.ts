import { useCallback, useEffect, useState } from "react";
import ioClient from "../../../api/socketApi";
import { Requests } from "../../../constants/constants";
import { IBoardData, IGameData, IResultPayload } from "../../../constants/socketIO/ServerEvents.interface";
import { useSocketConnect } from "../../../hooks/useSocketConnect";
import { Board, IBoard } from "../../../model/Board";
import { Colors } from "../../../model/colors.enum";
import { ISpritesObj } from "../../../model/figures/figures.interface";
import { BoardUlt, IBoardUlt } from "../../../model/ultimate/BoardUlt";
import { assignSpritePack } from "../../../utils/game.utils";
import { IPlayerInfo } from "../../ui/player/PlayerInfo.interface";

export const useGameRoom = (id?: string, isUltimate: boolean = false) => {

    const [board, setBoard] = useState<IBoard | IBoardUlt>(() => {
        const board = new Board();
        board.states.globalMovesCount = -1;
        return board
    })
    const [isReadyToStart, setIsReadyToStart] = useState(false);
    const [result, setResult] = useState<IResultPayload | null>(null);
    const [enemyUser, setEnemyUser] = useState<IPlayerInfo>();
    const [clientUser, setClientUser] = useState<IPlayerInfo>()
    const [myColor, setMyColor] = useState<Colors>(Colors.WHITE)
    const [request, setRequest] = useState<Requests | null>(null);
    const [isObserver, setIsObserver] = useState(false);
    const [isSkillBookOpen, setIsSkillBookOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isMobileMatchInfoOpen, setMobileMatchInfoOpen] = useState(false);
    const { isConnected } = useSocketConnect();


    const handleUpdateGame = useCallback((payload: IGameData) => {
        if (!payload) return; // payload with info about the client and the board
        setIsReadyToStart(true);
        setEnemyUser(prev => payload.playerTwo!);
        setClientUser(prev => payload.playerOne);
        setMyColor(prev => payload.myColor!);
        setIsObserver(prev => payload.isObserver ? payload.isObserver : false);

        drawBoard(payload.boardData!,
            assignSpritePack(payload.myColor!, payload.playerOne!, payload.playerTwo!),
            assignSpritePack(payload.myColor === Colors.BLACK ? Colors.WHITE : Colors.BLACK, payload.playerOne!, payload.playerTwo!));
    }, [])

    const clearStates = useCallback(() => {
        setRequest(null);
        setResult(null);
    }, [])

    const drawBoard = useCallback((boardData: IBoardData, whiteTeamSprites?: ISpritesObj, blackTeamSprites?: ISpritesObj) => {
        const newBoard = isUltimate ? new BoardUlt(whiteTeamSprites, blackTeamSprites) : new Board(whiteTeamSprites, blackTeamSprites);
        newBoard.startNewGame(boardData.FEN);
        newBoard.getFigures();
        newBoard.states = {
            ...newBoard.states,
            ...boardData.states
        }
        newBoard.mergeBoardData(boardData);
        setBoard(prev => newBoard);
        // clearStates();
    }, [request])

    const handleResults = useCallback((payload: IResultPayload) => {
        clearStates()
        board.states.isGameOver = true;
        setResult(prev => payload);
        setBoard(prev => prev.getCopyBoard())
    }, [board])

    const handleRequestConfirm = useCallback((request: Requests) => {
        if (isObserver) return;
        if (request === Requests.RESIGN) return ioClient.emit("resign");
        ioClient.emit("confirmRequest", request);

    }, [isObserver])

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
        ioClient.on("updateGame", handleUpdateGame);
        ioClient.on("inGameRequest", (request) => setRequest(request));
        ioClient.on("results", handleResults);

        return () => {
            ioClient.off("inGameRequest");
            ioClient.off('updateGame');
            ioClient.off("results");

        }

    }, [handleUpdateGame, handleResults, board])


    return {
        field: {
            board,
            setBoard,
            handleRequestConfirm,
            handleSendRequest,
            handleResults,
        },
        status: {
            isConnected,
            isReadyToStart,
            myColor,
            result,
            isObserver,
            isSkillBookOpen,
            setIsSkillBookOpen,
            isSettingsOpen,
            setIsSettingsOpen,
            isMobileMatchInfoOpen,
            setMobileMatchInfoOpen
        },
        data: {
            enemyUser,
            clientUser,
            request,
            setRequest,
        }


    }
}



