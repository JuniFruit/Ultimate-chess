import { ICell } from "../../model/Cell";

export interface IMove {
    currentCell: {
        x: number,
        y: number
    },
    targetCell: {
        x: number,
        y: number
    }
}

export interface IOClientEvents {
    joinGameRoom: (roomId:string) => void;
    sendMove: ({}:IMove) => void
}