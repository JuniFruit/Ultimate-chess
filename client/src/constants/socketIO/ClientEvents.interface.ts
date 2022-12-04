import { ICell } from "../../model/Cell";
import { FigureTypes } from "../../model/figures/Figures";
import { Results } from "../../model/helper.enum";

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

export interface IOClientEvents {
    joinGameRoom: (roomId: string) => void;
    sendMove: ({ }: IMove) => void;
    results: (payload: Results) => void;
}