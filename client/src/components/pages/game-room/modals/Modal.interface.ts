import { Dispatch, SetStateAction } from 'react';
import { Requests } from '../../../../constants/constants';
import { IResultPayload } from '../../../../constants/socketIO/ServerEvents.interface';

export interface IErrorModal {
    errorMsg: string,
    errorHandler: Dispatch<SetStateAction<string>>
}

export interface IGameOverModal {
    result: IResultPayload | null,
    isObserver: boolean;
    onRematch: () => void;
}

export interface IConfirmModal {   
    onConfirm: (arg: Requests) => void;
    request: Requests | null;
    onClose: () => void;
}