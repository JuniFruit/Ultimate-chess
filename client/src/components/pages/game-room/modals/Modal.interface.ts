import { Dispatch, SetStateAction } from 'react';
import { IResultPayload } from '../../../../constants/socketIO/ServerEvents.interface';
import { GameOver } from '../../../../model/helper.enum';

export interface IErrorModal {
    errorMsg: string,
    errorHandler: Dispatch<SetStateAction<string>>
}

export interface IGameOverModal {
    resultMsg: GameOver,
    onRematch?: () => void;
}