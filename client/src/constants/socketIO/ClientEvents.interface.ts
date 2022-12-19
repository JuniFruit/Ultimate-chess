import { ICellInfo } from "../../model/Cell";
import { FigureTypes } from "../../model/figures/figures.interface";
import { Requests } from "../constants";

export interface IMoveOptions {
    isFake?: boolean;
    isPromotion?: boolean;
    figureToPromote?: FigureTypes
    isCastling?: boolean;
    isEnPassant?:boolean;
    isTake?:boolean;

}

export interface IMove {
    from: ICellInfo;
    to: ICellInfo;
    options?: IMoveOptions
}



export interface IMessage {
    body: string;   
}

export interface IDisconnectedUser {
    username: string;   
}

export interface IOClientEvents {
    joinGameRoom: (roomId: string) => void;
    sendMove: (arg: IMove) => void;
    timeout: () => void;
    inGameRequest: (payload: Requests) => void;
    confirmRequest: (payload: Requests) => void;
    resign: () => void;
    message: (payload: IMessage) => void;
    ping: (cb: () => void) => void;
    disconnectTimeout: (user: IDisconnectedUser) => void;
    currentGames: () => void;
}