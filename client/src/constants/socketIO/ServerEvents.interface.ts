import { IPlayerInfo } from "../../components/ui/player/PlayerInfo.interface";
import { IBoard } from "../../model/Board";
import { ICell } from "../../model/Cell";
import { Colors } from "../../model/colors.enum";
import { IMove } from "./ClientEvents.interface";

export interface IStartPayload {
    color?: Colors,
    score?: number,
    user?: IPlayerInfo,
    opponentUser?: IPlayerInfo,
    board?: IBoard
}

export interface IOServerEvents {
    readyToStart: ({}:IStartPayload) => void;
    noOpponent: () => void;
    move: ({}:IMove) => void;
    gameError: (err:string) => void;
}