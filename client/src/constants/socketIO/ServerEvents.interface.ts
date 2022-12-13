import { IPlayerInfo } from "../../components/ui/player/PlayerInfo.interface";
import { IBoardStates } from "../../model/Board";
import { Colors } from "../../model/colors.enum";
import { Results } from "../../model/helper.enum";
import { IPlayer } from "../../model/Player";
import { IUser } from "../../types/user.interface";
import { Requests } from "../constants";
import { IDisconnectedUser, IMessage, IMovePayload } from "./ClientEvents.interface";

export interface IBoardData {
    boardFEN: string;
    states: IBoardStates;
}

export interface IStartPayload {
    color?: Colors,
    score?: number,
    user?: IUser,
    opponentUser?: IUser,
    boardData?: IBoardData
}

export interface IResultPayload {
    result: Results,
    loser: Colors
}

export interface IGameRoomShortData {
    room: string;
    players: IPlayer[];
}

export interface IMessagePayload extends IMessage {
    username: string;
    timestamp: number;
}

export interface IOServerEvents {
    updateGame: ({}:IStartPayload) => void;
    noOpponent: (user: IDisconnectedUser) => void;
    move: (payload: IMovePayload) => void;
    gameError: (err:string) => void;
    results: (payload: IResultPayload) => void;
    inGameRequest: (payload: Requests) => void;
    message: (payload: IMessagePayload) => void;
    currentGames: (games: IGameRoomShortData[]) => void;
    reconnect: () => void;
    noPlayers: () => void;
}