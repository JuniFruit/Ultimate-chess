import { ICell } from "../../model/Cell";

export interface IMove {
    currentCell: ICell,
    targetCell: ICell
}

export interface IOClientEvents {
    joinGameRoom: (roomId:string) => void;
    sendMove: ({}:IMove) => void
}