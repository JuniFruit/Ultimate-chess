import {Dispatch, SetStateAction} from 'react'
import { IMove } from "../../../../constants/socketIO/ClientEvents.interface";
import { IBoard } from "../../../../model/Board";


export interface IField {
    board: IBoard;
    setBoard: Dispatch<SetStateAction<IBoard>>
    ioMoveHandlers: {
        handleSendMove: (payload: IMove) => void
    }
}