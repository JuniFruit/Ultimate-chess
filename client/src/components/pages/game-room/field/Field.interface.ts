import {Dispatch, SetStateAction} from 'react'
import { IBoard } from "../../../../model/Board";
import { Colors } from '../../../../model/colors.enum';
import { IBoardUlt } from '../../../../model/ultimate/BoardUlt';


export interface IField {
    board: IBoard | IBoardUlt;
    setBoard: Dispatch<SetStateAction<IBoard>>   
    isObserver: boolean;
    myColor: Colors
}