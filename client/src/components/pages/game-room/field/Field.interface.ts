import {Dispatch, SetStateAction} from 'react'
import { IBoard } from "../../../../model/Board";
import { Colors } from '../../../../model/colors.enum';


export interface IField {
    board: IBoard;
    setBoard: Dispatch<SetStateAction<IBoard>>   
    isObserver: boolean;
    myColor: Colors
}