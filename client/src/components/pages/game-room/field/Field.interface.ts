import { Dispatch, SetStateAction } from 'react';
import { IBoard } from "../../../../model/Board";
import { Colors } from '../../../../model/colors.enum';
import { IBoardUlt } from '../../../../model/ultimate/BoardUlt';
import { ICellUlt } from '../../../../model/ultimate/CellUlt';


export interface IField {
    board: IBoard | IBoardUlt;
    setBoard: Dispatch<SetStateAction<IBoard>>   
    isObserver: boolean;
    myColor: Colors;
    isUltimate: boolean
    isSkillBookOpen: boolean;
    setIsSkillBookOpen: Dispatch<SetStateAction<boolean>>  
}

export interface IFieldUltimateStates {
    isUltimate: boolean;
    isSkillTargetSelecting: boolean;
    onSkillTargetSelect: (cell: ICellUlt) => void;
}