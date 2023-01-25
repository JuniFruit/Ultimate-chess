import { ValidationError } from 'class-validator';
import { MatchDuration } from '../../../client/src/constants/constants';


export const formErrorMessage = (errors: ValidationError[]) => {
    const message = errors.map(error => `${error.property} - ${Object.values(error.constraints!).join(', ')}`).join('; ');
    return message;
}

export const getInitTime = (room: string) => {
    if (room.includes('_1min')) return MatchDuration.ONE_MIN;
    if (room.includes('_10min')) return MatchDuration.TEN_MIN;
    if (room.includes('_3min')) return MatchDuration.THREE_MIN;
    return MatchDuration.FIVE_MIN;

}


export const validURL = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/
export const notEmpty = /^\w*$/;