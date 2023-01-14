import { IPlayerInfo } from "../../components/ui/player/PlayerInfo.interface";
import { IBoardStates } from "../../model/Board";
import { ICellData } from "../../model/Cell";
import { Colors } from "../../model/colors.enum";
import { GameOverReasons, Results } from "../../model/helper.enum";
import { IPlayer } from "../../model/Player";
import { Errors, Requests } from "../constants";
import { IDisconnectedUser, IMessage, IMove } from "./ClientEvents.interface";

export interface IBoardData {
    FEN: string;
    cells: ICellData[][];
    states: IBoardStates;
}

export interface IGameData {
    playerOne: IPlayerInfo,
    playerTwo: IPlayerInfo,
    myColor: Colors,
    boardData: IBoardData,
    isObserver: boolean
}

export interface ISocketData {
    user: IPlayerInfo,

}

export interface IResultPayload {
    result: Results;
    loser: Colors;
    reason?: GameOverReasons;
}

export interface IGameRoomShortData {
    room: string;
    players: IPlayer[]; 
}

export interface IMessagePayload extends IMessage {
    username: string;
    timestamp: number;
}

export interface ITimerPayload {
    white: number;
    black: number;
}

export interface IOServerEvents {
    updateGame: (payload: IGameData) => void;
    noOpponent: (user: IDisconnectedUser) => void;
    move: (move: IMove) => void;
    error: (err: Errors) => void;
    gameError: (err: Errors) => void;
    results: (payload: IResultPayload) => void;
    inGameRequest: (payload: Requests) => void;
    message: (payload: IMessagePayload) => void;
    currentGames: (games: IGameRoomShortData[]) => void;
    reconnect: () => void;
    noPlayers: () => void;
    updateTimer: (payload:ITimerPayload ) => void;
    
}