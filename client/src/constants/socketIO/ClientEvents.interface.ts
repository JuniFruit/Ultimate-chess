import { ICell } from "../../model/Cell";
import { FigureTypes } from "../../model/figures/Figures";

export interface IMoveOptions {
    isPromotion?: boolean;
    figureToPromote?: FigureTypes

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

export interface IOClientEvents {
    joinGameRoom: (roomId: string) => void;
    sendMove: ({ }: IMove) => void
}