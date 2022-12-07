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



export interface IOClientEvents {
    joinGameRoom: (roomId: string) => void;
    sendMove: ({ }: IMove) => void;
    timeout: () => void;
    inGameRequest: (payload: Requests) => void;
    confirmRequest: (payload: Requests) => void;
    resign: () => void;
}