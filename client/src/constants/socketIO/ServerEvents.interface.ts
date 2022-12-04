import { IPlayerInfo } from "../../components/ui/player/PlayerInfo.interface";
import { IBoard, IBoardStates } from "../../model/Board";
import { Colors } from "../../model/colors.enum";
import { Results } from "../../model/helper.enum";
import { IMove } from "./ClientEvents.interface";

export interface IBoardData {
    boardFEN: string;
    states: IBoardStates;
}

export interface IStartPayload {
    color?: Colors,
    score?: number,
    user?: IPlayerInfo,
    opponentUser?: IPlayerInfo,
    boardData?: IBoardData
}

export interface IResultPayload {
    result: Results,
    currentPlayer: Colors
}

export interface IOServerEvents {
    readyToStart: ({}:IStartPayload) => void;
    noOpponent: () => void;
    move: ({}:IMove) => void;
    gameError: (err:string) => void;
    results: (payload: IResultPayload) => void;
}