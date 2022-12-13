import { Colors } from "../../model/colors.enum";
import { FigureTypes } from "../../model/figures/Figures";
import { Requests } from "../constants";

export interface IMoveOptions {
    isPromotion?: boolean;
    figureToPromote?: string | FigureTypes

}

export interface IMove {
    currentCell: {
        x: number,
        y: number
    },
    targetCell: {
        x: number,
        y: number
    },
    options?: IMoveOptions
}

export interface IMovePayload {
    move: IMove,
    time: {
        white: number;
        black: number;
    }
}

export interface IMessage {
    body: string;   
}

export interface IDisconnectedUser {
    username: string;
    color: Colors;
    id: number;
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