import { Dispatch, SetStateAction } from 'react';
import { Requests } from '../../../../constants/constants';
import { GameOver } from '../../../../model/helper.enum';

export interface IErrorModal {
    errorMsg: string,
    errorHandler: Dispatch<SetStateAction<string>>
}

export interface IGameOverModal {
    resultMsg: GameOver,
    onRematch: () => void;
}

export interface IConfirmModal {   
    onConfirm: (arg: Requests) => void;
    request: Requests;
}