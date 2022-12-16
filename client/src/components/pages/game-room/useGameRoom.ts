import { useCallback, useEffect, useState } from "react";
import ioClient from "../../../api/socketApi";
import { Requests } from "../../../constants/constants";
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
    const [result, setResult] = useState<IResultPayload | null>(null);
    const [enemyUser, setEnemyUser] = useState<IPlayerInfo>();
    const [clientUser, setClientUser] = useState<IPlayerInfo>()   
    const [myColor, setMyColor] = useState<Colors>(Colors.WHITE)
    const [request, setRequest] = useState<Requests | null>(null);
    const [isObserver, setIsObserver] = useState(false);
    const { isConnected } = useSocketConnect();


    const handleUpdateGame = useCallback((payload: IGameData) => {
        if (!payload) return; // payload with info about the client and the board
        clearStates();
        console.log(payload);
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
        setIsReadyToStart(true);
        setResult(prev => payload);
        setBoard(prev => prev.getCopyBoard())
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
        ioClient.on("updateGame", handleUpdateGame);
        ioClient.on("inGameRequest", (request) => setRequest(request));      
        ioClient.on("results", handleResults);

        return () => {      
            ioClient.off("inGameRequest");         
            ioClient.off('updateGame');        
            ioClient.off("results");

        }

    }, [request, result, board, isObserver])   


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
            isObserver
        },
        data: {
            enemyUser,
            clientUser,                    
            request,        
            setRequest,    
        }
        

    }
}



