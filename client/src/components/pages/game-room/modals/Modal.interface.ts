import { Dispatch, SetStateAction } from 'react';

export interface IErrorModal {
    errorMsg: string,
    errorHandler: Dispatch<SetStateAction<string>>
}